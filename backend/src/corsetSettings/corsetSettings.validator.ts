import * as z from 'zod';

const subAuxiliarySchema = z.object({
    subAuxiliary : z.number().int(),
    subAuxiliaryInstruction: z.string(),
})

const thoracicSchema = z.object({
    thoracic : z.number().int(),
    thoracicInstruction: z.string(),
})

const lumbarSchema = z.object({
    lumbar : z.number().int(),
    lumbarInstruction: z.string(),
})

const trochanterSchema = z.object({
    trochanter : z.number().int(),
    trochanterInstruction: z.string(),
})

export const createCorsetSettingsSchema = z.object({
    corsetId: z.number().int(),
    subAuxiliary: subAuxiliarySchema,
    thoracic: thoracicSchema,
    lumbar: lumbarSchema,
    trochanter: trochanterSchema,
})

export const getCorsetSettingsByCorsetIdSchema = z.object({
    corsetId: z.coerce.number().int(),
})

export type CreateCorsetSettingsDto = z.infer<typeof createCorsetSettingsSchema>;
export type GetCorsetSettingsByCorsetIdDto = z.infer<typeof getCorsetSettingsByCorsetIdSchema>;
export type UpdateSubAuxiliaryDto = z.infer<typeof subAuxiliarySchema>;
