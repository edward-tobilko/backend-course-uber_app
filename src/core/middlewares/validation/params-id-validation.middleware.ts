import { param } from 'express-validator';

export const idParamValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .trim()
  .notEmpty()
  .withMessage('ID must not be empty')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

// ? Пояснення: Этот middleware проверяет, что id:
// * существует в запросе (exists()),
// * является строкой (isString()),
// * не пустое (isLength({ min: 1 })),
// * состоит только из цифр (isNumeric()).
