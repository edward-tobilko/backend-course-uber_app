import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';

export function deleteDriverHandler(req: Request, res: Response) {
  const driver = driversRepository.findDriverById(+req.params.id);

  if (!driver) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND_404)
      .json({ message: `Driver with id=${+req.params.id} not found` });
  }

  driversRepository.delete(+req.params.id);

  res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
}
