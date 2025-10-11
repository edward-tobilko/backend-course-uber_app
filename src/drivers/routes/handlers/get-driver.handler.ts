import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { mapToDriverOutput } from '../mappers/map-to-driver-output.mapper';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const driverId = await driversService.findDriverByIdOrFail(req.params.id);

    const driverOutput = mapToDriverOutput(driverId);

    res.status(HTTP_STATUS_CODES.OK_200).json(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
