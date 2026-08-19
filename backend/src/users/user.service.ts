import * as db from "./user.database.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import {
  userBodyCreate,
  updateUserBody,
  userParamSearch,
} from "./user.validator.js";
import { Role, User } from "../generated/prisma/client.js";

export async function getUserService(id: number) {
  const user = await db.getUserById(id);

  if (!user) {
    throw new NotFoundError(`L'utilisateur avec l'ID ${id} n'existe pas.`);
  }

  return user;
}

export async function createUserService(userData: userBodyCreate) {
  return await db.createUser(userData);
}

export async function updateUserService(
  userId: userParamSearch["id"],
  userData: updateUserBody,
) {
  await getUserService(userId);

  return await db.updateUser(userId, userData);
}

export async function getAllDoctorsPatients(doctorId: number) {
  const doctor = await db.getUserById(doctorId);
  if (!doctor) {
    throw new NotFoundError(`Le médecin avec l'ID ${doctorId} n'existe pas.`);
  }

  if (doctor.role !== Role.DOCTOR) {
    throw new BadRequestError(`User : ${doctorId} is not a doctor.`);
  }
  const patients = await db.getDoctorsPatients(doctorId);
  return patients;
}

export async function getAllParents(patientId: number) : Promise <User> {
  const patient = await db.getUserById(patientId);
  if (!patient) {
    throw new NotFoundError(`Le patient avec l'ID ${patientId} n'existe pas.`);
  }

  if (patient.role !== Role.PATIENT) {
    throw new BadRequestError(`User : ${patientId} is not a patient.`);
  }
  const parent = await db.getParents(patient.id);
  if(!parent) {
    throw new NotFoundError(`Le patient avec l'ID ${patientId} n'a pas de parent associé.`);
  }
  return parent;
}

export async function getPatientsDoctors(patientId: number) : Promise<User> {
  const patient = await db.getUserById(patientId);
  if (!patient) {
    throw new NotFoundError(`Le patient avec l'ID ${patientId} n'existe pas.`);
  }
  
  if (patient.role !== Role.PATIENT) {
    throw new BadRequestError(`User : ${patientId} is not a patient.`);
  }
  const doctors = patient.doctor;
  if(!doctors) {
    throw new NotFoundError(`Le patient avec l'ID ${patientId} n'a pas de médecin associé.`);
  }
  return doctors;
}
