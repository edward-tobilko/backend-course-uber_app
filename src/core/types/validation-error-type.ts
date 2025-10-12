import { HTTP_STATUS_CODES } from '../utils/http-statuses';

// * Type for createErrorMessages util func
export type ValidationErrorType = {
  status: HTTP_STATUS_CODES;
  detail: string;
  source?: string;
  code?: string;
};
