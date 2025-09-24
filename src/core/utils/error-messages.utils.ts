import { DriverValidationError } from '../../drivers/types/driver.types';

export const createErrorMessages = (
  errors: DriverValidationError[],
): { errorMessages: DriverValidationError[] } => {
  return { errorMessages: errors };
};
