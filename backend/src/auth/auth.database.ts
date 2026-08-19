import { prisma } from "../plugins/prisma.js";
import { TokenState } from "../generated/prisma/client.js";

export async function getUserHashByEmail(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { passwordHash: true },
  });
  return user ? user.passwordHash : null;
}

export async function createRefreshToken(params: {
  userId: number;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
}): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      userId: params.userId,
      tokenHash: params.tokenHash,
      familyId: params.familyId,
      expiresAt: params.expiresAt,
      status: TokenState.ACTIVE,
    },
  });
}

export async function findRefreshTokenByHash(tokenHash: string) {
  return prisma.refreshToken.findUnique({
    where: { tokenHash },
  });
}

export async function markRefreshTokenAsUsed(id: number): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { id : id, status: TokenState.ACTIVE },
    data: { status: TokenState.USED },
  });
  return result.count;
}

export async function revokeFamily(familyId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { familyId, status: TokenState.ACTIVE },
    data: { status: TokenState.REVOKED },
  });
}

export async function getUserById(userId: number) {
  return prisma.user.findUnique({ where: { id: userId } });
}