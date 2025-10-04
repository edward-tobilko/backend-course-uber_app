import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const ride = await ridesRepository.findRideById(req.params.id);

    if (!ride) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND_404).json(
        createErrorMessages([
          {
            field: 'id',
            message: `Ride with id=${+req.params.id} is not found`,
          },
        ]),
      );
    }

    const transformedToMapRideModel = mapToRideViewModelUtil(ride);

    res.status(HTTP_STATUS_CODES.OK_200).json(transformedToMapRideModel);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
