import { Router } from 'express';

import { getRidesListHandler } from './handlers/get-rides-list.handler';
import { createRideHandler } from './handlers/create-ride.handler';
import { adminGuardMiddlewareAuth } from '../../auth/middlewares/admin-guard.middleware';
import { getRideHandler } from './handlers/get-ride.handler';
import { idParamValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { rideBodyDtoValidation } from '../validation/ride-input-dto-validation.middleware';
import { finishRideHandler } from './handlers/finish-ride.handler';

export const ridesRouter = Router({});

ridesRouter.get('', getRidesListHandler);
ridesRouter.get(
  '/:id',
  idParamValidation,
  inputValidationResultMiddleware,
  getRideHandler,
);

ridesRouter.post(
  '',
  adminGuardMiddlewareAuth,
  rideBodyDtoValidation,
  inputValidationResultMiddleware,
  createRideHandler,
);
ridesRouter.post(
  '/:id/actions/finish',
  adminGuardMiddlewareAuth,
  idParamValidation,
  inputValidationResultMiddleware,
  finishRideHandler,
);
