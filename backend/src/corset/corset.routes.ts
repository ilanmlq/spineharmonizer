import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/schema-validator.js";

import {
  createCorsetSchema,
  idParamSchema,
  corsetDayQuerySchema,
  corsetRangeQuerySchema,
  CreateCorsetDto,
  IdParamDto,
  CorsetDayQueryDto,
  CorsetRangeQueryDto,
} from "./corset.validator.js";

import type { Request, Response } from "express";

import {
  getAllCorsets,
  getCorsetById,
  updateCorset,
  createCorset,
  getBatteryByCorsetId,
  getLatestCorsetEventByCorsetId,
  getTimeDayWornByCorsetId,
  getCorsetRangeWornTime,
} from "./corset.service.js";

export const corsetRoutes = Router();

corsetRoutes.get("/", async (request: Request, response: Response) => {
  try {
    const corsets = await getAllCorsets();
    response.status(200).json(corsets);
  } catch (error) {
    response.status(404).json({ message: (error as Error).message });
  }
});

corsetRoutes.post(
  "/",
  validateBody(createCorsetSchema),
  async (request: Request, response: Response) => {
    const corsetData = request.parsedBody as CreateCorsetDto;

    const corset = await createCorset(corsetData);
    response.status(201).json(corset);
  },
);

corsetRoutes.get(
  "/:id",
  validateParams(idParamSchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;

    try {
      const corset = await getCorsetById(id);
      response.status(200).json(corset);
    } catch (error) {
      response.status(404).json({ message: (error as Error).message });
    }
  },
);

corsetRoutes.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(createCorsetSchema.partial()),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    const corsetData = request.parsedBody as Partial<CreateCorsetDto>;

    const corset = await updateCorset(id, corsetData);
    response.status(200).json({ id, corset });
  },
);
corsetRoutes.get(
  "/:id/battery",
  validateParams(idParamSchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;

    try {
      const battery = await getBatteryByCorsetId(id);
      response.status(200).json(battery);
    } catch (error) {
      response.status(404).json({ message: (error as Error).message });
    }
  },
);

corsetRoutes.get(
  "/:id/latest-event",
  validateParams(idParamSchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;

    try {
      const latestEvent = await getLatestCorsetEventByCorsetId(id);
      response.status(200).json(latestEvent);
    } catch (error) {
      response.status(404).json({ message: (error as Error).message });
    }
  },
);
corsetRoutes.get(
  "/:id/compliance/day",
  validateParams(idParamSchema),
  validateQuery(corsetDayQuerySchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    const { date } = request.parsedQuery as CorsetDayQueryDto;

    try {
      const totalWornMinutes = await getTimeDayWornByCorsetId(id, date);

      response.status(200).json({ totalWornMinutes });
    } catch (error) {
      console.error("Erreur route compliance:", error);
      response.status(500).json({
        message: "Erreur lors du calcul du temps de portage",
      });
    }
  },
);

corsetRoutes.get(
  "/:id/compliance/range",
  validateParams(idParamSchema),
  validateQuery(corsetRangeQuerySchema),
  async (request: Request, response: Response) => {
    const { id } = request.parsedParams as IdParamDto;
    const { startDate, endDate } = request.parsedQuery as CorsetRangeQueryDto;

    try {
      const totalWornMinutes = await getCorsetRangeWornTime(
        id,
        startDate,
        endDate,
      );

      response.status(200).json({ totalWornMinutes });
    } catch (error) {
      console.error("Erreur route compliance:", error);
      response.status(500).json({
        message: "Erreur lors du calcul du temps de portage",
      });
    }
  },
);
