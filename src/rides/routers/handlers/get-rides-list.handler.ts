import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function getRidesListHandler(_req: Request, res: Response) {
  try {
    const fetchAllRides = await ridesRepository.findAllRides();

    const mappedRidesResponse = fetchAllRides.map(mapToRideViewModelUtil);

    res.status(HTTP_STATUS_CODES.OK_200).json(mappedRidesResponse);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
