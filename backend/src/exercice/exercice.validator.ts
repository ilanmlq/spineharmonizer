import * as z from 'zod';
import { Role } from '../generated/prisma/client.js';

export const createExerciceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.url('Invalid image URL'),
    url: z.url('Invalid URL'),
});

export const idParamSchema = z.object({
    id : z.coerce.number().int('ID must be a positive integer')
});

export type CreateExerciceDto = z.infer<typeof createExerciceSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;