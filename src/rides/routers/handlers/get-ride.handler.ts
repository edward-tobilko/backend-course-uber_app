import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';

export function getRideHandler(req: Request<{ id: string }>, res: Response) {
  const ride = ridesRepository.findRideById(+req.params.id);

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

  res.status(HTTP_STATUS_CODES.OK_200).json(ride);
}
