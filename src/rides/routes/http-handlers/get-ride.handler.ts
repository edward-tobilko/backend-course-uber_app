import { Request, Response } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { ridesQueryService } from '../../application/rides-query.service';
import { createCommand } from '../../../core/helpers/create-command';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getRideHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const command = createCommand<{ id: string }>({ id: req.params.id });
    const rideOutput = await ridesQueryService.findRideByIdOrFail(
      command.payload.id,
    ); // получаем  id  как строку от фронтов, затем передаем ее в наш репозиторий, чтобы пропарсить { _id: new Object(id) } ее для нашей mongoDB

    log('rideOutput ->', rideOutput);

    res.status(HTTP_STATUS_CODES.OK_200).json(rideOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);

    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
