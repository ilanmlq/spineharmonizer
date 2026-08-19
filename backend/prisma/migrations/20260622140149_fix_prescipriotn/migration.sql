/*
  Warnings:

  - You are about to drop the `_PrescriptionExercises` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prescriptionId` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PrescriptionExercises" DROP CONSTRAINT "_PrescriptionExercises_A_fkey";

-- DropForeignKey
ALTER TABLE "_PrescriptionExercises" DROP CONSTRAINT "_PrescriptionExercises_B_fkey";

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "prescriptionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PrescriptionExercises";

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
