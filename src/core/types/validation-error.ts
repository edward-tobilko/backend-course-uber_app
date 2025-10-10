import { HTTP_STATUS_CODES } from '../utils/http-statuses';

export type ValidationError = {
  status: HTTP_STATUS_CODES;
  detail: string;
  source?: string;
  code?: string;
};
