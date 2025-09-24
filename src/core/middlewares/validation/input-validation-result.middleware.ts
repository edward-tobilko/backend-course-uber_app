import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';

import { HTTP_STATUS_CODES } from '../../types/http-statuses';

const formatErrors = (error: ValidationError) => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path, // Поле с ошибкой
    message: expressError.msg, // Сообщение ошибки
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req).formatWith(formatErrors).array();

  if (errors.length) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .json({ errorMessages: errors });
  }

  next(); // Если ошибок нет, передаём управление дальше
};
