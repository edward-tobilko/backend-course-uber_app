import { Response } from 'express';

import { RepositoryNotFoundError } from './repository-not-found.error';
import { HTTP_STATUS_CODES } from '../utils/http-statuses';
import { createErrorMessages } from '../utils/error-messages.util';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HTTP_STATUS_CODES.NOT_FOUND_404;

    res.status(httpStatus).json(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  if (error instanceof DomainError) {
    const httpStatus = HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY_422;

    res.status(httpStatus).json(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
          source: error.source,
          code: error.code,
        },
      ]),
    );

    return;
  }

  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);

  return;
}
