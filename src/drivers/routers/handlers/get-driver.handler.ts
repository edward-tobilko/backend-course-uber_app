import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModelUtil } from '../mappers/map-to-driver-view-model.util';

export async function getDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const driver = await driversRepository.findDriverById(req.params.id);

    if (!driver) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND_404)
        .send(
          createErrorMessages([{ message: 'Driver not found', field: 'id' }]),
        );
    }

    const driverViewModelResponse = mapToDriverViewModelUtil(driver);

    res.status(HTTP_STATUS_CODES.OK_200).json(driverViewModelResponse);
  } catch (e: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
