import { z } from "zod";
import { Role } from "../generated/prisma/browser.js";

export const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(Role, "Invalid Role"),
  email: z.string().optional(),
  parentsId: z.number().int().optional(),
  doctorId: z.number().int().optional(),
});




export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
