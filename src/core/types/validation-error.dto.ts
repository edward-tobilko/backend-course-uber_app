import { HTTP_STATUS_CODES } from './../utils/http-statuses';

// * ValidationErrorOutput model
type ValidationErrorOutput = {
  status: HTTP_STATUS_CODES;
  detail: string;
  source: { pointer: string };
  code: string | null;
};

export type ValidationErrorListOutput = { errors: ValidationErrorOutput[] };
