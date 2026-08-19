export interface Exercise {
  id: number;
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface ExerciseRealization {
  id: number;
  startedAt: string;
  finishedAt: string;
  repsDone: number;
  done: boolean;
}

export interface ProgramOnExercise {
  id: number;
  programId: number;
  exerciseId: number;
  sets: number;
  repetitions: number;
  time: number;
  exerciseRealizationId: number | null;
  exercise: Exercise;
  exerciseRealizations: ExerciseRealization[] | null;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  patientId: number;
  doctorId: number;
  prescriptionId: number;
  createdAt: string;
  exercises: ProgramOnExercise[];
}