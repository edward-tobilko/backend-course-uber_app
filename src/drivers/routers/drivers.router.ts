import { Router } from 'express';

import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { updateDriverPutHandler } from './handlers/update-driver-put.handler';
import { updateDriverPatchHandler } from './handlers/update-driver-patch.handler';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';

export const driversRouter = Router({});

// * Routes
// ? method GET
driversRouter.get('', getDriverListHandler);
driversRouter.get(
  `/:driverId`,
  idValidation,
  inputValidationResultMiddleware,
  getDriverHandler,
);

// ? method POST
driversRouter.post('', createDriverHandler);

// ? method DELETE
driversRouter.delete('/:id', deleteDriverHandler);

// ? method UPDATE
driversRouter.put('/:id', updateDriverPutHandler);
driversRouter.patch('/:id', updateDriverPatchHandler);
