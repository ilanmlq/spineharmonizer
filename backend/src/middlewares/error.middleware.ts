import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
  err: Error | AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  // Vérifier si c'est une erreur opérationnelle (erreur métier)
  if (err instanceof AppError) {
    // Erreur métier prévue (4XX) - log en warning
    console.warn(`error {statusCode: ${err.statusCode}, message: ${err.message}}`);
    console.warn(err.stack);
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Erreur non prévue (500) - log en error
  console.error(`error {message: ${err.message}}`);
  console.error(err.stack);

  return res.status(500).json({
    message: 'Internal Server Error',
  });
};