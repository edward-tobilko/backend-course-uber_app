import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesService } from '../../../rides/application/rides.service';
import { mapToRideListPaginatedOutput } from '../../../rides/application/mappers/map-to-ride-list-paginated-output.mapper';
import { GetRideListRequestPayload } from '../../../rides/routes/request-type-payloads/get-ride-list.request-payload';

export async function getDriverRidesListHandler(
  req: Request<{ id: string }, {}, {}, GetRideListRequestPayload>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    // * Приводимо типи до number, так як значення з query приходять строкою
    const pageNumber = Number(queryInput.pageNumber) || 1;
    const pageSize = Number(queryInput.pageSize) || 10;

    const data = await ridesService.findRidesByDriver(driverId, queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(data.items, {
      pageNumber,
      pageSize,
      totalCount: data.totalCount,
    });

    res.json(rideListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
