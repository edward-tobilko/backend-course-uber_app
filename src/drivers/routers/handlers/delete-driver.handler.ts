import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { ridesRepository } from '../../../rides/repositories/rides.repository';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';

export async function deleteDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    const driver = await driversRepository.findDriverById(id);

    if (!driver) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND_404)
        .json({ message: `Driver with id=${id} not found` });
    }

    // * Если у водителя сейчас есть заказ, то удалить его нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);

    if (activeRide) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .send(
          createErrorMessages([
            { message: 'The driver is currently on a job', field: 'status' },
          ]),
        );
      return;
    }

    await driversRepository.delete(id);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
