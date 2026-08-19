import cors from "cors";
import express from "express";
import { prisma } from "./plugins/prisma.js";
import healthRoutes from "./health/health.route.js";
import { logMiddleware } from "./middlewares/log.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { exerciceRoutes } from "./exercice/exercice.routes.js";
import { corsetRoutes } from "./corset/corset.routes.js";
import { corsetSettingsRoutes } from "./corsetSettings/corsetSettings.routes.js";
import { corsetEventRoutes } from "./corsetEvent/corsetEvent.routes.js";
import { programRoutes } from "./program/program.routes.js";
import userRoutes from "./users/user.routes.js";
import { authRoutes } from "./auth/auth.routes.js";

export function buildApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logMiddleware);

  app.locals.prisma = prisma;
  app.use("/health", healthRoutes);
  app.use("/exercice", exerciceRoutes);
  app.use("/corset", corsetRoutes);
  app.use("/corset-settings", corsetSettingsRoutes);
  app.use("/corset-event", corsetEventRoutes);
  app.use("/users", userRoutes);
  app.use("/program", programRoutes);
app.use("/auth", authRoutes);
  app.use(errorHandler);
  return app;
}
