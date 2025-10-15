import { Router } from 'express';

import { getRidesListHandler } from './handlers/get-rides-list.handler';
import { createRideHandler } from './handlers/create-ride.handler';
import { adminGuardMiddlewareAuth } from '../../auth/middlewares/admin-guard.middleware';
import { getRideHandler } from './handlers/get-ride.handler';
import { idParamValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { finishRideHandler } from './handlers/finish-ride.handler';
import { rideCreateInputDtoValidation } from '../validation/ride-input-dto-validation.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';
import { RideSortFieldEnumInput } from './input/ride-sort-field-enum.input';

export const ridesRoute = Router({});

ridesRoute.get(
  '',
  paginationAndSortingValidation(RideSortFieldEnumInput),
  getRidesListHandler,
);
ridesRoute.get(
  '/:id',
  idParamValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

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
