import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { DriverCreateTypeInput } from '../input/driver-create-type.input';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.mapper';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function createDriverHandler(
  req: Request<{}, {}, DriverCreateTypeInput>,
  res: Response,
) {
  try {
    const createdDriverId = await driversService.create(
      req.body.data.attributes,
    );

    const createdDriver =
      await driversService.findDriverByIdOrFail(createdDriverId);

    const driverOutput = mapToDriverOutput(createdDriver); // додаємо id з mongoDB (_id: Object("someIdString"))

    res.status(HTTP_STATUS_CODES.CREATED_201).json(driverOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
