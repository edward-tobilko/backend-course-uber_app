import { Request, Response } from 'express';
import { log } from 'node:console';

import { ridesRepository } from '../../repositories/rides.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { createErrorMessages } from '../../../core/utils/error-messages.util';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-output.mapper';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const ride = await ridesRepository.findRideById(req.params.id); // отримуємо  id  як строку від фронтів, потім віддаємо її в наш репозиторій, щоп пропарсити { _id: new Object(id) } її для нашої mongoDB

    if (!ride) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND_404).json(
        createErrorMessages([
          {
            message: `Ride with id=${req.params.id} is not found`,
            field: 'id',
          },
        ]),
      );

      return;
    }

    log(ride?._id);

    const transformedToMapRideModel = mapToRideViewModelUtil(ride);

    res.status(HTTP_STATUS_CODES.OK_200).json(transformedToMapRideModel);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
