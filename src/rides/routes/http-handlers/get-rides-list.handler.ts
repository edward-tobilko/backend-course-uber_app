import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { ridesService } from '../../application/rides.service';
import { GetRideListRequestPayload } from '../request-type-payloads/get-ride-list.request-payload';
import { RideSortField } from '../request-type-payloads/ride-sort-field-enum';
import { ridesQueryService } from '../../application/rides-query.service';

export async function getRidesListHandler(
  req: Request<{}, {}, {}, GetRideListRequestPayload>,
  res: Response,
) {
  try {
    // * в req.query остаются сырые параметры запроса (строки)
    const queryInput = setDefaultSortAndPaginationIfNotExist<RideSortField>(
      req.query,
    );

    const ridesListOutput = await ridesQueryService.findAllRides(queryInput);

    res.status(HTTP_STATUS_CODES.OK_200).json(ridesListOutput);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
