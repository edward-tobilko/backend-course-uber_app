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
import { adminGuardMiddlewareAuth } from '../../auth/middlewares/admin-guard.middleware';

export const driversRouter = Router({});

// driversRouter.use(adminGuardMiddlewareAuth); // Применяем мидлвейр ко всем запросам в этом роутере

// * Routes
// ? method GET
driversRouter.get('', getDriverListHandler);
driversRouter.get(
  `/:id`,
  idParamValidation,
  inputValidationResultMiddleware,
  getDriverHandler,
);

// ? method POST
driversRouter.post(
  '',
  adminGuardMiddlewareAuth, // проверяет авторизацию для данного запроса.
  driverInputBodyDtoValidation, // проверяет, что данные, передаваемые в теле запроса, соответствуют ожидаемой структуре.
  inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию.
  createDriverHandler, // основной обработчик запроса, который создаёт водителя, если все предыдущие мидлвейры прошли успешно.
);

// ? method DELETE
driversRouter.delete(
  '/:id',
  adminGuardMiddlewareAuth,
  idParamValidation,
  inputValidationResultMiddleware,
  deleteDriverHandler,
);

// ? method UPDATE
driversRouter.put(
  '/:id',
  adminGuardMiddlewareAuth,
  idParamValidation,
  driverInputBodyDtoValidation,
  inputValidationResultMiddleware,
  updateDriverPutHandler,
);
driversRouter.patch(
  '/:id',
  adminGuardMiddlewareAuth,
  idParamValidation,
  inputValidationResultMiddleware,
  updateDriverPatchHandler,
);
