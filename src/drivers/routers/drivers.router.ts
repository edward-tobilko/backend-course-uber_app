import { Router } from 'express';

import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverHandler } from './handlers/get-driver.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { updateDriverPutHandler } from './handlers/update-driver-put.handler';
import { updateDriverPatchHandler } from './handlers/update-driver-patch.handler';

export const driversRouter = Router({});

// * Routes
// ? method GET
driversRouter.get('', getDriverListHandler);
driversRouter.get(`/:driverId`, getDriverHandler);

// ? method POST
driversRouter.post('', createDriverHandler);

// ? method DELETE
driversRouter.delete('/:id', deleteDriverHandler);

// ? method UPDATE
driversRouter.put('/:id', updateDriverPutHandler);
driversRouter.patch('/:id', updateDriverPatchHandler);
