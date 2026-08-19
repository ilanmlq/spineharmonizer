import { z } from "zod";
import { prisma } from "../plugins/prisma.js";
import { Role } from "../generated/prisma/enums.js";

export const userParamSearch = z.object({
  id: z.coerce.number().int(),
});

export const userBodyCreate = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(Role, "Invalid Role"),
  email: z.string().optional(),
  parentsId: z.number().int().optional(),
  doctorId: z.number().int().optional(),
});

export const updateUserBody = z.object({
  id: z.number().int(),
  username: z.string().optional(),
  password: z.string().optional(),
  role: z.enum(Role, "Invalid Role").optional(),
  email: z.string().optional(),
  parentsId: z.number().int().optional(),
  doctorId: z.number().int().optional(),
});

export type userParamSearch = z.infer<typeof userParamSearch>;
export type userBodyCreate = z.infer<typeof userBodyCreate>;
export type updateUserBody = z.infer<typeof updateUserBody>;
