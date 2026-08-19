import { Router } from "express";
import {
  validateParams,
  validateBody,
} from "../middlewares/schema-validator.js";
import {
  userBodyCreate,
  userParamSearch,
  updateUserBody,
} from "./user.validator.js";
import type { Request, Response, NextFunction } from "express";
import * as userService from "./user.service.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRoutes = Router();
userRoutes.use(requireAuth);
userRoutes.get(
  "/me",
  async (request: Request, response: Response) => {
    const userId = request.user?.sub;
    if (!userId) {
      return response.status(401).json({ message: "User ID not found in token" });
    }
    const user = await userService.getUserService(Number(userId));
    if(!user) {
      return response.status(404).json({ message: "User not found" });
    }
    delete (user as any).password;
    delete (user as any).passwordHash;
    response.status(200).json(user);
  }
);

userRoutes.get(
  "/patients/:id",
  validateParams(userParamSearch),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as userParamSearch;
    const patients = await userService.getAllDoctorsPatients(id);
    response.status(200).json(patients);
  },
);

userRoutes.get(
  "/parents/:id",
  validateParams(userParamSearch),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as userParamSearch;
    const parents = await userService.getAllParents(id);
    response.status(200).json(parents);
  },
);

userRoutes.get(
  "/doctors/:id",
  validateParams(userParamSearch),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as userParamSearch;
    const doctors = await userService.getPatientsDoctors(id);
    response.status(200).json(doctors);
  },
);

userRoutes.get(
  "/:id",
  validateParams(userParamSearch),
  async (request: Request, response: Response) => {
    const userData = request.parsedParams as userParamSearch;
    const user = await userService.getUserService(userData.id);
    response.status(200).json(user);
  },
);

userRoutes.post(
  "/",
  validateBody(userBodyCreate),
  async (request: Request, response: Response) => {
    const userData = request.parsedBody as userBodyCreate;
    const user = await userService.createUserService(userData);
    response.status(201).json(user);
  },
);

userRoutes.put(
  "/:id",
  validateParams(userParamSearch),
  validateBody(updateUserBody),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as userParamSearch;
    const userData = request.parsedBody as updateUserBody;
    const user = await userService.updateUserService(id, userData);
    response.status(200).json(user);
  },
);

export default userRoutes;
