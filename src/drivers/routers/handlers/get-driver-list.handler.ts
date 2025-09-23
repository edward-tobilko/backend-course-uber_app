import { Request, Response } from 'express';

import { driversRepository } from '../../repositories/drivers.repository';
import { HTTP_STATUS_CODES } from '../../../core/types/http-statuses';

export function getDriverListHandler(_req: Request, res: Response) {
  const drivers = driversRepository.findAll();

  res.status(HTTP_STATUS_CODES.OK_200).json(drivers);
}
