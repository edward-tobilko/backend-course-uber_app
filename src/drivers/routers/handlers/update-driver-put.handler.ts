import { Request, Response } from 'express';

import { DriverInputDto } from '../../dto/driver.input-dto';
import { HTTP_STATUS_CODES } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';

export function updateDriverPutHandler(
  req: Request<{ id: string }, {}, DriverInputDto>,
  res: Response,
) {
  const id = +req.params.id;

  const driver = driversRepository.findDriverById(id);

  if (!driver) {
    res
      .status(HTTP_STATUS_CODES.NOT_FOUND_404)
      .json({ message: `Driver with id=${id} not found` });
  }

  driversRepository.updatePut(id, req.body);
  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
}
