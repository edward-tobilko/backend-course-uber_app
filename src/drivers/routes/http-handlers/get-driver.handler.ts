import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { driversQueryService } from '../../application/driver-query.service';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const driverOutput = await driversQueryService.findDriverByIdOrFail(
      req.params.id,
    );

    res.status(HTTP_STATUS_CODES.OK_200).json(driverOutput);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
