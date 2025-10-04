import { body } from 'express-validator';

import { Currency } from '../types/ride.types';

export const clientNameValidation = body('clientName')
  .exists()
  .withMessage('Client name is required')
  .bail()
  .isString()
  .withMessage('Client name should be a string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Client name must be 3-100 characters long');

export const driverIdValidation = body('driverId')
  .exists()
  .withMessage('Driver ID is required');

export const priceValidation = body('price')
  .exists()
  .withMessage('Price is required')
  .bail()
  .isFloat({ gt: 0 }) // Проверка, что цена - это число больше 0
  .withMessage('Price must be a positive number');

export const currencyValidation = body('currency')
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

export const startAddressValidation = body('fromAddress')
  .exists()
  .withMessage('From address is required')
  .bail()
  .isString()
  .withMessage('From address should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('From address must be 3-200 characters long');

export const endAddressValidation = body('toAddress')
  .exists()
  .withMessage('To address is required')
  .bail()
  .isString()
  .withMessage('To address should be string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('To address must be 3-200 characters long');

export const rideBodyDtoValidation = [
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
