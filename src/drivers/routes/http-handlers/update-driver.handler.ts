import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { UpdateDriverRequestPayload } from '../request-payloads/update-driver-request.payload';
import { createCommand } from '../../../core/helpers/create-command';
import { UpdateDriverDtoCommand } from '../../application/commands/driver-dto-type.commands';

export async function updateDriverHandler(
  req: Request<{ id: string }, {}, UpdateDriverRequestPayload>,
  res: Response,
) {
  try {
    const command = createCommand<UpdateDriverDtoCommand>({
      id: req.params.id,
      ...req.body.data.attributes,
    });
    await driversService.update(command);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
