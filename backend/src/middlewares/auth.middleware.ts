import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors.js";

const secretKey = process.env.JWT_SECRET as string;

interface AccessTokenPayload {
  sub: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

// Garde de type : vérifie réellement la forme du payload au runtime
function isAccessTokenPayload(payload: string | JwtPayload): payload is AccessTokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof payload.sub !== "undefined" &&
    typeof (payload as any).username === "string" &&
    typeof (payload as any).role === "string"
  );
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or malformed Authorization header"));
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ["HS256"] });

    if (!isAccessTokenPayload(decoded)) {
      return next(new UnauthorizedError("Invalid access token payload"));
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Access token expired"));
    }
    return next(new UnauthorizedError("Invalid access token"));
  }
}