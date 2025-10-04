import { Request, Response } from 'express';
import { log } from 'node:console';

import { driversRepository } from '../../repositories/drivers.repository';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { mapToDriverViewModelUtil } from '../mappers/map-to-driver-view-model.util';

export async function getDriverListHandler(_req: Request, res: Response) {
  try {
    const drivers = await driversRepository.findAll();
    const driverViewModels = drivers.map(mapToDriverViewModelUtil);

    log(driverViewModels);

    res.json(driverViewModels);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}

// ? Що відбувається тут:
// * Контролер отримує HTTP-запит (GET /drivers).
// * Викликає репозиторій findAll() → отримує сирі документи з бази (_id, __v, тощо).
// * Далі кожен документ мапиться через mapToDriverViewModelUtil, який формує зручну форму для фронтенду.
// * У кінці повертає JSON через res.json().
