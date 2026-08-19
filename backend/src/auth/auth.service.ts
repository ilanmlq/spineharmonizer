import { UnauthorizedError } from "../utils/errors.js";
import * as db from "./auth.database.js"
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername} from "../users/user.database.js"
import * as bc from "bcrypt";
import { TokenState, User } from "../generated/prisma/client.js";
import crypto from "crypto";
import { uuidv4 } from "zod/v4/mini";
import { RegisterDTO } from "./auth.validator.js";

const SALT_ROUNDS = 10;
// Helpers --------------------------------------------------------------------
const secretKey = process.env.JWT_SECRET as string;
function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    secretKey,
    { expiresIn: "15m" } 
  );
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bc.compare(password, hash);
}

// Service Functions ----------------------------------------------------------

async function issueRefreshToken(userId: number, familyId: string): Promise<string> {
  const raw = generateRefreshToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

  await db.createRefreshToken({
    userId,
    tokenHash: hashToken(raw),
    familyId,
    expiresAt,
  });

  return raw;
}

// Login -----------------------------------------------------------------------
export async function login(username: string,password: string): Promise<{ token: string; refreshToken: string }> {
  const user = await getUserByUsername(username);
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }
  console.log("User found:", user);
  const verified = await verifyPassword(password, user.passwordHash);
  if (!verified) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const token = generateAccessToken(user);
  const familyId = crypto.randomUUID(); // nouvelle famille à chaque login
  const refreshToken = await issueRefreshToken(user.id, familyId);

  return { token, refreshToken };
}


export async function register(userData : RegisterDTO) : Promise<{ token: string; refreshToken: string }> {
    const existingUser = await getUserByUsername(userData.username);
    if (existingUser) {
        throw new UnauthorizedError("Username already exists");
    }
    
    userData.password = await bc.hash(userData.password, SALT_ROUNDS);
    const newUser = await createUser(userData);
    const token = generateAccessToken(newUser);
    const familyId = crypto.randomUUID();
    const refreshToken = await issueRefreshToken(newUser.id, familyId);
    return { token, refreshToken };

}

// Refresh Token Rolling ----------------------------------------------------------------

export async function refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {

    const tokenHash = hashToken(refreshToken);
    const existingToken = await db.findRefreshTokenByHash(tokenHash);
    console.log("Token hash" , tokenHash);
    console.log("Existing token from DB:" , existingToken);

    if(!existingToken){
        console.log("Refresh token not found in database");
        throw new UnauthorizedError("Invalid refresh token");
    }
    if(existingToken.status !== TokenState.ACTIVE){
        throw new UnauthorizedError("Refresh token is not active");
    }
    if(existingToken.expiresAt < new Date()){
        throw new UnauthorizedError("Refresh token has expired");
    }

    const user = await db.getUserById(existingToken.userId);
    if(!user){
        throw new UnauthorizedError("User not found for this refresh token");
    }
    await db.markRefreshTokenAsUsed(existingToken.id); // Marquer le token actuel comme utilisé

    const newToken = generateAccessToken(user);
    if(!existingToken.familyId){
        throw new UnauthorizedError("Family ID is missing for this refresh token");
    }
    const newRefreshToken = await issueRefreshToken(user.id, existingToken.familyId); // Réutiliser le même familyId

    return { token: newToken, refreshToken: newRefreshToken };

}