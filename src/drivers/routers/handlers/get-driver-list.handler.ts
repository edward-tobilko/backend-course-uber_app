import { Request, Response } from 'express';

import { driversRepository } from '../../repositories/drivers.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export function getDriverListHandler(_req: Request, res: Response) {
  try {
    const drivers = driversRepository.findAll();
    res.json(drivers);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
