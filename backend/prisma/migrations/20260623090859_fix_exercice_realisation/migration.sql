/*
  Warnings:

  - You are about to drop the column `programExerciseId` on the `ExerciseRealization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[exerciseRealizationId]` on the table `ProgramOnExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ExerciseRealization" DROP CONSTRAINT "ExerciseRealization_programExerciseId_fkey";

-- AlterTable
ALTER TABLE "ExerciseRealization" DROP COLUMN "programExerciseId";

-- AlterTable
ALTER TABLE "ProgramOnExercise" ADD COLUMN     "exerciseRealizationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "ProgramOnExercise_exerciseRealizationId_key" ON "ProgramOnExercise"("exerciseRealizationId");

-- AddForeignKey
ALTER TABLE "ProgramOnExercise" ADD CONSTRAINT "ProgramOnExercise_exerciseRealizationId_fkey" FOREIGN KEY ("exerciseRealizationId") REFERENCES "ExerciseRealization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
