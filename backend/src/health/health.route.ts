import { Router } from "express";
import {prisma} from "../plugins/prisma.js";
import { NotFoundError } from "../utils/errors.js";
const healthRoutes = Router();

healthRoutes.get("/", (_request, response) => {
  response.json({
    status: "ok",
    uptime: process.uptime()
  });
});

healthRoutes.get("/db", async (request, response, next) => {
  try {

    await prisma.$queryRaw`SELECT 1`;

    response.json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    next(error);
  }
});


healthRoutes.get("/db/schema", async (request, response, next) => {
  try {

    const schema = await prisma.$queryRaw<
      {
        table_name: string;
        column_name: string;
        data_type: string;
        is_nullable: string;
      }[]
    >`
      SELECT
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    response.json(schema);
  } catch (error) {
    next(error);
  }
});


healthRoutes.get("/testError", async (request, response, next) => {
    const users = prisma.user.findMany();
    
    throw new NotFoundError("Users not found");
    
    
});

export default healthRoutes;
