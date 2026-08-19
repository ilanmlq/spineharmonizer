import {  Router } from "express";
import { validateBody, validateParams } from "../middlewares/schema-validator.js";
import { CreateExerciceDto, createExerciceSchema, IdParamDto, idParamSchema } from "./exercice.validator.js";
import type { Request, Response } from "express";
import { getAllExercices, getExerciceById, updateExercice, createExercice, toggleExercice } from "./exercice.service.js";
export const exerciceRoutes = Router();


exerciceRoutes.get(
  '/',
  async (request: Request, response: Response) => {
    const exercices = await getAllExercices();
    response.status(200).json(exercices);
  }
);

exerciceRoutes.post(
  '/',
  validateBody(createExerciceSchema),
  async (request: Request, response: Response) => {
    const exerciceData = request.parsedBody as CreateExerciceDto;
    const newExercice = await createExercice(exerciceData);
    response.status(201).json(newExercice);
  }
);

exerciceRoutes.get(
  '/:id',
  validateParams(idParamSchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    const exercice = await getExerciceById(id);
    response.status(200).json(exercice);
  }
);

exerciceRoutes.put(
  '/:id',
  validateParams(idParamSchema),
  validateBody(createExerciceSchema.partial()),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    const exerciceData = request.parsedBody as Partial<CreateExerciceDto>;
    const exercice = await updateExercice(id,exerciceData);
    response.status(200).json({ id, exercice });
  }
);

exerciceRoutes.get(
  "/:id/toggle",
  validateParams(idParamSchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    await toggleExercice(id);
    response.status(200).json({ message: "Exercice toggled successfully" });
  }
);