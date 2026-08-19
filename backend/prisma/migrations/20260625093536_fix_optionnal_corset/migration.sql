-- DropForeignKey
ALTER TABLE "Corset" DROP CONSTRAINT "Corset_patientId_fkey";

-- AlterTable
ALTER TABLE "Corset" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Corset" ADD CONSTRAINT "Corset_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
