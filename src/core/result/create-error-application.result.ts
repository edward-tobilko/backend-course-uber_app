import { ApplicationError } from '../errors/application.error';
import { ApplicationResult } from './application.result';

export function createErrorApplicationResult(
  message: string,
  code: any,
  throwError: boolean = true,
) {
  const applicationError = new ApplicationError(message, code);

  if (throwError) {
    throw applicationError;
  }

  return new ApplicationResult({ errors: [applicationError], data: null });
}
