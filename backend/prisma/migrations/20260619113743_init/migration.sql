-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'DOCTOR', 'PARENT');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('WORN', 'NOT_WORN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentsId" INTEGER,
    "doctorId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corset" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,

    CONSTRAINT "Corset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorsetSetting" (
    "id" SERIAL NOT NULL,
    "corsetId" INTEGER NOT NULL,
    "subAuxiliary" INTEGER NOT NULL,
    "lumbar" INTEGER NOT NULL,
    "thoracic" INTEGER NOT NULL,
    "trochanter" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorsetSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorsetEvent" (
    "id" SERIAL NOT NULL,
    "corsetId" INTEGER NOT NULL,
    "battery" INTEGER NOT NULL,
    "state" "State" NOT NULL,
    "subAuxiliary" INTEGER NOT NULL,
    "lumbar" INTEGER NOT NULL,
    "thoracic" INTEGER NOT NULL,
    "trochanter" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorsetEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "patientId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramOnExercise" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "ProgramOnExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseRealization" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "repsDone" INTEGER NOT NULL,
    "programExerciseId" INTEGER NOT NULL,

    CONSTRAINT "ExerciseRealization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Corset_patientId_key" ON "Corset"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentsId_fkey" FOREIGN KEY ("parentsId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corset" ADD CONSTRAINT "Corset_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorsetSetting" ADD CONSTRAINT "CorsetSetting_corsetId_fkey" FOREIGN KEY ("corsetId") REFERENCES "Corset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CorsetEvent" ADD CONSTRAINT "CorsetEvent_corsetId_fkey" FOREIGN KEY ("corsetId") REFERENCES "Corset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramOnExercise" ADD CONSTRAINT "ProgramOnExercise_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramOnExercise" ADD CONSTRAINT "ProgramOnExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseRealization" ADD CONSTRAINT "ExerciseRealization_programExerciseId_fkey" FOREIGN KEY ("programExerciseId") REFERENCES "ProgramOnExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
