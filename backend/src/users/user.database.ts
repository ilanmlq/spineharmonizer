import { prisma } from "../plugins/prisma.js";
import {
  userBodyCreate,
  updateUserBody,
  userParamSearch,
} from "./user.validator.js";
import { Role } from "../generated/prisma/enums.js";
import { BadRequestError } from "../utils/errors.js";
import { User } from "../generated/prisma/client.js";

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      patients: {
        include: {
          prescription: true,
          corset: true,
          parent: true,
          doctor: true,
        },
      },
      children: {
        include: {
          prescription: true,
          corset: true,
          doctor: true,
        },
      },
      parent: true,
      doctor: true,
      prescription: true,
      corset: true,
    },
  });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

export async function createUser(userData: userBodyCreate) {
  return await prisma.user.create({
    data: {
      ...userData,
      passwordHash: userData.password,
    },
  });
}

export async function updateUser(
  id: userParamSearch["id"],
  userData: updateUserBody,
) {
  const { id: _, ...dataToUpdate } = userData;

  return await prisma.user.update({
    where: { id },
    data: dataToUpdate,
  });
}


export async function getDoctorsPatients(doctorId: number) {
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId, role: Role.DOCTOR },
    include: {
      patients: {
        include: {
          prescription: true,
          corset: true,
        },
      },
    },
  });
  if(!doctor) {
    throw new BadRequestError(`Doctor with ID ${doctorId} not found.`);
  }
  return doctor.patients;
}

export async function getParents(patientId: number) : Promise<User | null> {
  const patient = await prisma.user.findUnique({
    where: { id: patientId, role: Role.PATIENT },
    include: {
      parent: true,
    },
  });
  if(!patient) {
    throw new BadRequestError(`Patient with ID ${patientId} not found.`);
  }
  return patient.parent;
}
