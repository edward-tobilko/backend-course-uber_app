import { Request, Response } from 'express';
import { log } from 'node:console';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { driversService } from '../../application/drivers.service';
import { CreateDriverRequestPayload } from '../request-payloads/create-driver-request.payload';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { createCommand } from '../../../core/helpers/create-command';
import { driversQueryService } from '../../application/driver-query.service';
import { CreateDriverDtoCommand } from '../../application/commands/driver-dto-type.commands';

export async function createDriverHandler(
  req: Request<{}, {}, CreateDriverRequestPayload>,
  res: Response,
) {
  try {
    const command = createCommand<CreateDriverDtoCommand>(
      req.body.data.attributes,
    );

    const result = await driversService.create(command);

    log('result ->', result);

    const driverOutput = await driversQueryService.findDriverByIdOrFail(
      result.data!.id,
    );

    res.status(HTTP_STATUS_CODES.CREATED_201).json(driverOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
