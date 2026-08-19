import * as z from "zod";

export const createCorsetEventSchema = z.object({
  corsetId: z.number().int(),
  battery: z.number().int(),
  state: z.enum(["WORN", "NOT_WORN"]),
  subAuxiliary: z.number().int(),
  lumbar: z.number().int(),
  thoracic: z.number().int(),
  trochanter: z.number().int(),
  timestamp: z.string(),
});

export const getCorsetEventsByCorsetIdSchema = z.object({
  corsetId: z.coerce.number().int(),
});

export type CreateCorsetEventDto = z.infer<typeof createCorsetEventSchema>;
export type GetCorsetEventsByCorsetIdDto = z.infer<
  typeof getCorsetEventsByCorsetIdSchema
>;
