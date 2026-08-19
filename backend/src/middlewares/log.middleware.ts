import type { NextFunction, Request, Response } from "express";

export function logMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const start = performance.now();

  console.info(
    `[IN ] ${request.method} ${request.originalUrl} `,
  );

  response.on("finish", () => {
    const duration = (performance.now() - start).toFixed(2);

    console.info(
      `[OUT] ${request.method} ${request.originalUrl} ${response.statusCode} - ${duration}ms`,
    );
  });

  next();
}