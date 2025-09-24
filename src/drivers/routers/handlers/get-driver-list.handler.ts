import { Request, Response } from 'express';

import { driversRepository } from '../../repositories/drivers.repository';

export function getDriverListHandler(_req: Request, res: Response) {
  const drivers = driversRepository.findAll();

  res.json(drivers);
}
