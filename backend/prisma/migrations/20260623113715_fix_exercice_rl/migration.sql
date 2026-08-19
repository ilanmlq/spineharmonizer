/*
  Warnings:

  - You are about to drop the column `exerciseRealizationId` on the `ProgramOnExercise` table. All the data in the column will be lost.
  - Added the required column `programOnExerciseId` to the `ExerciseRealization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProgramOnExercise" DROP CONSTRAINT "ProgramOnExercise_exerciseRealizationId_fkey";

-- DropIndex
DROP INDEX "ProgramOnExercise_exerciseRealizationId_key";

-- AlterTable
ALTER TABLE "ExerciseRealization" ADD COLUMN     "programOnExerciseId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProgramOnExercise" DROP COLUMN "exerciseRealizationId";

-- AddForeignKey
ALTER TABLE "ExerciseRealization" ADD CONSTRAINT "ExerciseRealization_programOnExerciseId_fkey" FOREIGN KEY ("programOnExerciseId") REFERENCES "ProgramOnExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
