import z from "zod";

export const userParamSearchSchema = z.object({
  id: z.coerce.number().int(),
});

export const programExerciseSchema = z.object({
  exerciseId: z.number().int(),
  sets: z.number().int(),
  repetitions: z.number().int(),
  time: z.number().int(),
});

export const createProgramSchema = z.object({
  patientId: z.number().int(),
  doctorId: z.number().int(),
  prescriptionId: z.number().int(),
  name: z.string(),
  description: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  exercises: z.array(programExerciseSchema),
});

export type UserParamSearch = z.infer<typeof userParamSearchSchema>;
export type CreateProgramDto = z.infer<typeof createProgramSchema>;
export type ProgramExerciseDto = z.infer<typeof programExerciseSchema>;