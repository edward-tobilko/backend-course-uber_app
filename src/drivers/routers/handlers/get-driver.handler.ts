import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';
import { driversRepository } from '../../repositories/drivers.repository';

export function getDriverHandler(req: Request<{ id: string }>, res: Response) {
  const driver = driversRepository.findDriverById(+req.params.id);

  if (!driver) {
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND_404)
      .send(
        createErrorMessages([{ field: 'id', message: 'Driver not found' }]),
      );
  }

  res.status(HTTP_STATUS_CODES.OK_200).json(driver);
}
