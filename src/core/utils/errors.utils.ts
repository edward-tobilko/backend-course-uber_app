export type DriverValidationError = {
  field: string;
  message: string;
};

export const createErrorMessages = (
  errors: DriverValidationError[],
): { errorMessages: DriverValidationError[] } => {
  return { errorMessages: errors };
};
