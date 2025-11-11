import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { createCommand } from '../../../core/helpers/create-command';

export async function deleteDriverHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const command = createCommand({ id: req.params.id });

    await driversService.delete(command);

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
