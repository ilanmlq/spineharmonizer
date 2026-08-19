import * as z from "zod";

export const createCorsetSchema = z.object({
  patientId: z.number().int("Patient ID must be an integer").nullable(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int("ID must be a positive integer"),
});

export const corsetDayQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export const corsetRangeQuerySchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
});

export type CreateCorsetDto = z.infer<typeof createCorsetSchema>;
export type IdParamDto = z.infer<typeof idParamSchema>;
export type CorsetDayQueryDto = z.infer<typeof corsetDayQuerySchema>;
export type CorsetRangeQueryDto = z.infer<typeof corsetRangeQuerySchema>;
