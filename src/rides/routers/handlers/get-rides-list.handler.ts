import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { RideQueryTypeInput } from '../input/ride-query-type.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { ridesService } from '../../application/rides.service';
import { mapToRideListPaginatedOutput } from './../mappers/map-to-ride-list-paginated-output.mapper';

export async function getRidesListHandler(
  req: Request<{}, {}, RideQueryTypeInput>,
  res: Response,
) {
  try {
    // * утиліта для вилучення трансформованих значень після валідатора
    const sanitizedQuery = matchedData<RideQueryTypeInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    // * в req.query залишаються сирі параметри запиту (рядки)
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const data = await ridesService.findAllRides(queryInput);

    const rideListOutput = mapToRideListPaginatedOutput(data.items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: data.totalCount,
    });

    res.status(HTTP_STATUS_CODES.OK_200).json(rideListOutput);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
