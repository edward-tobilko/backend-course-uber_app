import { ValidationErrorType } from './types/validation-error-type';
import { ValidationErrorListTypeOutput } from './types/validation-error-type.output';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListTypeOutput => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail, // error message
      source: { pointer: error.source ?? '' }, // error field
      code: error.code ?? null, // domain error code
    })),
  };
};
