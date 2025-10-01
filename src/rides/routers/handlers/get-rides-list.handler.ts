import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export function getRidesListHandler(_req: Request, res: Response) {
  const fetchAllRides = ridesRepository.findAllRides();

  res.status(HTTP_STATUS_CODES.OK_200).json(fetchAllRides);
}
