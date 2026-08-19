import { Program } from "../generated/prisma/client.js";
import {prisma} from "../plugins/prisma.js";
import { CreateProgramDto, ProgramExerciseDto } from "./program.validator.js";

export function getProgramByPatientId(patientId: number) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return prisma.program.findMany({
    where: { patientId },
    include: {
      exercises: {
        include: {
          exercise: true,
          exerciseRealizations: {
            where: {
              startedAt: {
                gte: startOfToday,
                lte: endOfToday,
              },
            },
            orderBy: {
              startedAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });
}

export function createProgram(program: CreateProgramDto) : Promise<Program> {
    return prisma.program.create({
        data: {
            patient: {
                connect: {
                    id: program.patientId,
                },
            },
            doctor: {
                connect: {
                    id: program.doctorId,
                },
            },
            prescription: {
                connect: {
                    id: program.prescriptionId,
                },
            },
            name: program.name,
            description: program.description,
            startDate: program.startDate,
            endDate: program.endDate,
            exercises: {
                create: program.exercises.map((ex) => ({
                    exercise: { connect: { id: ex.exerciseId } },
                    sets: ex.sets,
                    repetitions: ex.repetitions,
                    time: ex.time
                })),
            },
        },
    });
}