import { query } from 'express-validator';

const searchTermQueryMiddlewareValidation = (fieldName: string) => {
  return query(fieldName)
    .customSanitizer((queryValue: unknown) =>
      typeof queryValue === 'string' ? queryValue.trim() : queryValue,
    )
    .optional({ checkFalsy: true })
    .isString()
    .matches(/^[\p{L}\s'-]+$/u)
    .withMessage(`${fieldName} must contain only letters`);
};

export const searchTermsQueryValidation = [
  searchTermQueryMiddlewareValidation('searchDriverNameTerm'),
  searchTermQueryMiddlewareValidation('searchDriverEmailTerm'),
  searchTermQueryMiddlewareValidation('searchVehicleMakeTerm'),
];
