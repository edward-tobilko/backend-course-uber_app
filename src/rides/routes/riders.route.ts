import { Router } from 'express';

import { getRidesListHandler } from './http-handlers/get-rides-list.handler';
import { createRideHandler } from './http-handlers/create-ride.handler';
import { adminGuardMiddlewareAuth } from '../../auth/middlewares/admin-guard.middleware';
import { getRideHandler } from './http-handlers/get-ride.handler';
import { idParamValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { finishRideHandler } from './http-handlers/finish-ride.handler';
import { rideCreateInputDtoValidation } from '../validation/ride-input-dto-validation.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';
import { RideSortField } from './request-type-payloads/ride-sort-field-enum';

export const ridesRoute = Router({});

// * GET
ridesRoute.get(
  '',
  paginationAndSortingValidation<RideSortField>(RideSortField),
  getRidesListHandler,
);

ridesRoute.get(
  '/:id',
  idParamValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

// * POST
ridesRoute.post(
  '',
  adminGuardMiddlewareAuth,
  rideCreateInputDtoValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);

ridesRoute.post(
  '/:id/actions/finish',
  adminGuardMiddlewareAuth,
  idParamValidation,
  inputValidationResultMiddleware,
  finishRideHandler,
);
