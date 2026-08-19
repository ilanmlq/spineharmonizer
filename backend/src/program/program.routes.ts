import { Router } from "express";
import { IdParamDto } from "../corset/corset.validator.js";
import type { Request, Response } from "express";
import { createProgram, getLatestProgramByPatientId } from "./program.service.js";
import { validateBody, validateParams } from "../middlewares/schema-validator.js";
import { CreateProgramDto, createProgramSchema, UserParamSearch, userParamSearchSchema } from "./program.validator.js";

export const programRoutes = Router();

programRoutes.get(
  "/me/:id", 
  validateParams(userParamSearchSchema),
  async (request: Request, response: Response) => {
    const {id} = request.parsedParams as UserParamSearch;
    const program = await getLatestProgramByPatientId(id);
    response.status(200).json(program);
  }
);

programRoutes.post(
  "/",
  validateBody(createProgramSchema),
  async (request: Request, response: Response) => {
    const program = request.parsedBody as CreateProgramDto;

    await createProgram(program);
    response.status(201).json(program);
  }
)