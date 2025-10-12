import { HTTP_STATUS_CODES } from '../utils/http-statuses';

// * ValidationErrorOutput model
type ValidationErrorTypeOutput = {
  status: HTTP_STATUS_CODES;
  detail: string;
  source: { pointer: string };
  code: string | null;
};

export type ValidationErrorListTypeOutput = {
  errors: ValidationErrorTypeOutput[];
};
