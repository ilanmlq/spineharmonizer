import { prisma } from "../plugins/prisma.js";
import { AppError } from "../utils/errors.js";
import { CreateExerciceDto } from "./exercice.validator.js";

export function createExercice(exerciceData: CreateExerciceDto){
    return prisma.exercise.create({
        data: {
            name: exerciceData.name,
            description: exerciceData.description,
            image: exerciceData.image,
            url: exerciceData.url,
        }
    });
}

export function getAllExercices() {
    return prisma.exercise.findMany();
}

export function getExerciceById(id: number) {
    return prisma.exercise.findUnique({
        where: { id },
    });
}

export function updateExercice(id: number, exerciceData: Partial<CreateExerciceDto>) {
    return prisma.exercise.update({
        where: { id },
        data: exerciceData,
    });
}

export function getTodayRealisationByExerciceId(id: number) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    return prisma.exerciseRealization.findFirst({
        where: {
            programOnExerciseId: id,
            startedAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
        orderBy: {
            startedAt: "desc",
        }
    });
}

async function getCurrentDoneStatus(realisationId: number) {
    const toggle = await prisma.exerciseRealization.findUnique({
        where: { id: realisationId },
        select: { done: true },
    });

    if (!toggle) {
        throw new AppError(`Realisation with id ${realisationId} not found`, 404);
    }
    if (toggle.done === undefined) {
        throw new AppError(`Done status for realisation with id ${realisationId} is undefined`, 400);
    }

    return toggle.done;
}



export async function toggleExerciceRealisation(realisationId: number) {
    const currentStatus = await getCurrentDoneStatus(realisationId);
    return prisma.exerciseRealization.update({
        where: { id: realisationId },
        data: {
            done: {
                set : !currentStatus,
            },
        },
    });
}

export async function createExerciceRealisation(exerciceId: number) {
    return prisma.exerciseRealization.create({
        data: {
            programOnExerciseId: exerciceId,
            startedAt: new Date(),
            finishedAt: new Date(),
            repsDone: 0,
            done: true,
        },
    });
}