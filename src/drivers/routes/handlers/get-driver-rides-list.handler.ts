import { Request, Response } from 'express';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesService } from '../../../rides/application/rides.service';
import { RideQueryTypeInput } from '../../../rides/routers/input/ride-query-type.input';
import { mapToRideListPaginatedOutput } from '../../../rides/routers/mappers/map-to-ride-list-paginated-output.mapper';

export async function getDriverRidesListHandler(
  req: Request<{ id: string }, {}, {}, RideQueryTypeInput>,
  res: Response,
) {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    const data = await ridesService.findRidesByDriver(driverId, queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(data.items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: data.totalCount,
    });

    res.json(rideListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
