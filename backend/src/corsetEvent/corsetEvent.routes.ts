import { Router } from "express";
import type { Request, Response } from "express";
import {
  validateBody,
  validateParams,
} from "../middlewares/schema-validator.js";
import {
  CreateCorsetEventDto,
  createCorsetEventSchema,
  getCorsetEventsByCorsetIdSchema,
  GetCorsetEventsByCorsetIdDto,
} from "./corsetEvent.validator.js";
import {
  createCorsetEvent,
  getCorsetEventsByCorsetId,
} from "./corsetEvent.service.js";

export const corsetEventRoutes = Router();

corsetEventRoutes.post(
  "/",
  validateBody(createCorsetEventSchema),
  async (request: Request, response: Response) => {
    const data = request.parsedBody as CreateCorsetEventDto;
    const event = await createCorsetEvent(data);
    response.status(201).json(event);
  },
);

corsetEventRoutes.get(
  "/:corsetId",
  validateParams(getCorsetEventsByCorsetIdSchema),
  async (request: Request, response: Response) => {
    const { corsetId } = request.parsedParams as GetCorsetEventsByCorsetIdDto;
    const events = await getCorsetEventsByCorsetId(corsetId);
    response.status(200).json(events);
  },
);

corsetEventRoutes.get(
  "/:corsetId/last",
  validateParams(getCorsetEventsByCorsetIdSchema),
  async (request: Request, response: Response) => {
    const { corsetId } = request.parsedParams as GetCorsetEventsByCorsetIdDto;
    const events = await getCorsetEventsByCorsetId(corsetId);
    const lastEvent = events[events.length - 1];
    response.status(200).json(lastEvent);
  },
);
