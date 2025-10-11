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

// ? exists() - существует в запросе
// ? isString() - является строкой
// ? isNumeric() - состоит только из цифр

// ? value — це значення data.id
// ? req — це об’єкт запиту
