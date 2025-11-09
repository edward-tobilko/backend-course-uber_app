import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { CreateDriverRequestPayload } from '../request-payloads/create-driver-request.payload';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToDriverOutput } from '../../application/mappers/map-to-driver-output.mapper';
import { createCommand } from '../../../core/helpers/create-command';

export async function createDriverHandler(
  req: Request<{}, {}, CreateDriverRequestPayload>,
  res: Response,
) {
  try {
    const command = createCommand(req.body.data.attributes);

    const createdDriverId = await driversService.create(command);

    const driverOutput =
      await driversService.findDriverByIdOrFail(createdDriverId);

    const driverOutput = mapToDriverOutput(createdDriver); // додаємо id з mongoDB (_id: Object("someIdString"))

    res.status(HTTP_STATUS_CODES.CREATED_201).json(driverOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
