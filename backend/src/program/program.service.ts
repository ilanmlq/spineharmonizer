import { Program, ProgramOnExercise, Role } from "../generated/prisma/client.js";
import { AppError, BadRequestError } from "../utils/errors.js";
import * as db from "./program.database.js";
import { getUserService } from "../users/user.service.js";
import { CreateProgramDto, ProgramExerciseDto } from "./program.validator.js";

export async function getLatestProgramByPatientId(patientId: number) : Promise < ProgramOnExercise[]> {
    const user = await getUserService(patientId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if(user.role !== Role.PATIENT) {
        throw new BadRequestError("User is not a patient");
    }
    const program = await db.getProgramByPatientId(patientId);
    if (!program || program.length === 0) {
        return [];
    }
    const exercises = program[program.length - 1].exercises;

    return exercises;

}

export async function createProgram(
    program : CreateProgramDto
) : Promise<Program> {
    const user = await getUserService(program.patientId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if(user.role !== Role.PATIENT) {
        throw new BadRequestError("User is not a patient");
    }
    const createdProgram = await db.createProgram(program);
    return createdProgram;
}
