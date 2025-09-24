import { Router } from 'express';

import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { updateDriverPutHandler } from './handlers/update-driver-put.handler';
import { updateDriverPatchHandler } from './handlers/update-driver-patch.handler';
import { idParamValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { driverInputBodyDtoValidation } from '../validation/driver-input-dto-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';

export const driversRouter = Router({});

// * Routes
// ? method GET
driversRouter.get('', getDriverListHandler);
driversRouter.get(
  `/:driverId`,
  idParamValidation,
  inputValidationResultMiddleware,
  getDriverHandler,
);

// ? method POST
driversRouter.post(
  '',
  driverInputBodyDtoValidation,
  inputValidationResultMiddleware,
  createDriverHandler,
);

// ? method DELETE
driversRouter.delete(
  '/:id',
  idParamValidation,
  inputValidationResultMiddleware,
  deleteDriverHandler,
);

// ? method UPDATE
driversRouter.put(
  '/:id',
  idParamValidation,
  driverInputBodyDtoValidation,
  inputValidationResultMiddleware,
  updateDriverPutHandler,
);
driversRouter.patch(
  '/:id',
  idParamValidation,
  inputValidationResultMiddleware,
  updateDriverPatchHandler,
);
