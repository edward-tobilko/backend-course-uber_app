import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { GetRideListRequestPayload } from '../../../rides/routes/request-type-payloads/get-ride-list.request-payload';
import { ridesQueryService } from '../../../rides/application/rides-query.service';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export async function getDriverRidesListHandler(
  req: Request<{ id: string }, {}, {}, GetRideListRequestPayload>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    const ridesListOutput = await ridesQueryService.findRidesByDriver(
      driverId,
      queryInput,
    );

    res.status(HTTP_STATUS_CODES.OK_200).json(ridesListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}

// ? Request<Params, ResBody, ReqBody, Query>
