import { Request, Response } from 'express';

import { DriverInputDto } from '../../dto/driver-input-dto.type';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, DriverInputDto>,
  res: Response,
) {
  try {
    const driver = driversRepository.findDriverById(req.params.id);

    if (!driver) {
      res
        .status(HTTP_STATUS_CODES.NOT_FOUND_404)
        .json({ message: `Driver with id=${req.params.id} not found` });
    }

    await driversRepository.update(req.params.id, req.body);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
