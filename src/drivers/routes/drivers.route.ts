import { Router } from 'express';

import { getDriverListHandler } from './http-handlers/get-driver-list.handler';
import { getDriverHandler } from './http-handlers/get-driver.handler';
import { createDriverHandler } from './http-handlers/create-driver.handler';
import { deleteDriverHandler } from './http-handlers/delete-driver.handler';
import { updateDriverHandler } from './http-handlers/update-driver.handler';
import { idParamValidation } from '../../core/middlewares/validation/params-id-validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { adminGuardMiddlewareAuth } from '../../auth/middlewares/admin-guard.middleware';
import {
  createDriverRequestPayloadValidation,
  updateDriverRequestPayloadValidation,
} from './validation/driver-request-payload.validation-middlewares';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting-validation.middleware';
import { DriverSortFieldInputEnum } from './request-payloads/driver-sort-field-enum';
import { getDriverRidesListHandler } from './http-handlers/get-driver-rides-list.handler';
import { RideSortFieldEnumInput } from '../../rides/routes/input/ride-sort-field-enum.input';

export const driversRoute = Router({});

// driversRouter.use(adminGuardMiddlewareAuth); // Применяем мидлвейр ко всем запросам в этом роутере

// * Routes
// ? method GET
driversRoute.get(
  '',
  paginationAndSortingValidation(DriverSortFieldInputEnum),
  inputValidationResultMiddleware,
  getDriverListHandler,
);
driversRoute.get(
  `/:id`,
  idParamValidation,
  inputValidationResultMiddleware,
  getDriverHandler,
);
driversRoute.get(
  `/:id/rides`,
  idParamValidation,
  paginationAndSortingValidation(RideSortFieldEnumInput),
  inputValidationResultMiddleware,
  getDriverRidesListHandler,
);

// ? method POST
driversRoute.post(
  '',
  adminGuardMiddlewareAuth, // проверяет авторизацию для данного запроса.
  createDriverRequestPayloadValidation, // проверяет, что данные, передаваемые в теле запроса, соответствуют ожидаемой структуре.
  inputValidationResultMiddleware, // проверяет, прошли ли данные валидацию.
  createDriverHandler, // основной обработчик запроса, который создаёт водителя, если все предыдущие мидлвейры прошли успешно.
);

// ? method DELETE
driversRoute.delete(
  '/:id',
  adminGuardMiddlewareAuth,
  idParamValidation,
  inputValidationResultMiddleware,
  deleteDriverHandler,
);

// ? method UPDATE
driversRoute.put(
  '/:id',
  adminGuardMiddlewareAuth,
  idParamValidation,
  updateDriverRequestPayloadValidation,
  inputValidationResultMiddleware,
  updateDriverHandler,
);
