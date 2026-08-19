import { Router } from "express";
import type { Request, Response } from "express";
import { validateBody, validateParams } from "../middlewares/schema-validator.js";
import {
  CreateCorsetSettingsDto,
  createCorsetSettingsSchema,
  getCorsetSettingsByCorsetIdSchema,
  GetCorsetSettingsByCorsetIdDto,
} from "./corsetSettings.validator.js";
import {
  createCorsetSettings,
  getCorsetSettingsByCorsetId,
} from "./corsetSettings.service.js";

export const corsetSettingsRoutes = Router();

corsetSettingsRoutes.post(
  "/",
  validateBody(createCorsetSettingsSchema),
  async (request: Request, response: Response) => {
    const data = request.parsedBody as CreateCorsetSettingsDto;
    const settings = await createCorsetSettings(data);
    response.status(201).json(settings);
  }
);

corsetSettingsRoutes.get(
  "/:corsetId",
  validateParams(getCorsetSettingsByCorsetIdSchema),
  async (request: Request, response: Response) => {
    const { corsetId } = request.parsedParams as GetCorsetSettingsByCorsetIdDto;
    const settings = await getCorsetSettingsByCorsetId(corsetId);
    response.status(200).json(settings);
  }
);
