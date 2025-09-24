import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';

import { HTTP_STATUS_CODES } from '../../utils/http-statuses';

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
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .json({ errorMessages: errors });
  }

  next(); // Если ошибок нет, передаём управление дальше
};

// ? Explanation:
// * { onlyFirstError: true } - покажет нам первую ошибку филда, а не все сразу
