
import { NotFoundError } from '../utils/errors.js';
import * as db from './exercice.database.js';
import { CreateExerciceDto } from './exercice.validator.js';

export function createExercice(exerciceData: CreateExerciceDto){
    return db.createExercice(exerciceData);

}

export function getAllExercices() {
    const exercices = db.getAllExercices();
    if (!exercices) {
        throw new NotFoundError('No exercices found');
    }
    return exercices;
}

export function getExerciceById(id: number) {
    const exercice = db.getExerciceById(id);
    if (!exercice) {
        throw new NotFoundError('Exercice not found');
    }
    return exercice;
}

export function updateExercice(id: number, exerciceData: Partial<CreateExerciceDto>) {
    return db.updateExercice(id, exerciceData);
}

export async function toggleExercice(id: number) {
    const realisation = await db.getTodayRealisationByExerciceId(id);
    if (realisation) {
        await db.toggleExerciceRealisation(realisation.id);
    } else {
        await db.createExerciceRealisation(id);
    }
}