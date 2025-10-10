import { body, param } from 'express-validator';

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

// * додаємо id валідацію на driverId в тілі post
export const dataIdBodyValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL param and data body must match');
    }

    return true;
  });

// ? Пояснення: Этот middleware проверяет, что id:
// * существует в запросе (exists()),
// * является строкой (isString()),
// * не пустое (isLength({ min: 1 })),
// * состоит только из цифр (isNumeric()).
