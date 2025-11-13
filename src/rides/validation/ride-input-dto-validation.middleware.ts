import { body } from 'express-validator';

import { Resources } from '../../core/types/resources-enum';
import { resourceEnumValidation } from '../../core/middlewares/validation/resource-enum-validation.middleware';
import { Currency } from '../domain/ride.domain';

export const clientNameValidation = body('data.attributes.clientName')
  .exists()
  .withMessage('Client name is required')
  .bail()
  .isString()
  .withMessage('Client name should be a string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Client name must be 3-100 characters long');

export const driverIdValidation = body('data.attributes.driverId')
  .exists()
  .withMessage('Driver ID is required')
  .bail()
  .isString()
  .withMessage('Driver ID must be a string')
  .bail()
  .isMongoId()
  .withMessage('Driver ID must be a valid Mongo ObjectId');

export const priceValidation = body('data.attributes.price')
  .exists()
  .withMessage('Price is required')
  .bail()
  .isFloat({ gt: 0 }) // Проверка, что цена - это число больше 0
  .withMessage('Price must be a positive number');

export const currencyValidation = body('data.attributes.currency')
  .exists()
  .withMessage('Currency is required')
  .bail()
  .isString()
  .withMessage('Currency should be string')
  .trim()
  .isIn(Object.values(Currency)) // Проверка на допустимые значения
  .withMessage(
    `Currency must be one of: ${Object.values(Currency).join(', ')}`,
  );

export const startAddressValidation = body('data.attributes.fromAddress')
  .exists()
  .withMessage('From address is required')
  .bail()
  .isString()
  .withMessage('From address should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('From address must be 3-200 characters long');

export const endAddressValidation = body('data.attributes.toAddress')
  .exists()
  .withMessage('To address is required')
  .bail()
  .isString()
  .withMessage('To address should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('To address must be 3-200 characters long');

export const rideCreateInputDtoValidation = [
  // * data.type
  resourceEnumValidation(Resources.Rides),

  // * data.attributes
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
