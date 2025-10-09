import { DriverValidationError } from '../../drivers/types/driver.types';

export const createErrorMessages = (
  errors: DriverValidationError[],
): { errorsMessages: DriverValidationError[] } => {
  return { errorsMessages: errors };
};
