import { query } from 'express-validator';

export const searchTermQueryMiddlewareValidation = (fieldName: string) => {
  return query(fieldName)
    .customSanitizer((queryValue: unknown) =>
      typeof queryValue === 'string' ? queryValue.trim() : queryValue,
    )
    .optional({ checkFalsy: true })
    .isString()
    .withMessage(`${fieldName} must be a string`);
};

export const searchTermsQueryValidation = [
  searchTermQueryMiddlewareValidation('searchDriverNameTerm'),
  searchTermQueryMiddlewareValidation('searchDriverEmailTerm'),
  searchTermQueryMiddlewareValidation('searchVehicleMakeTerm'),
];
