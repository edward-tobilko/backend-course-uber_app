import { Request, Response } from 'express';
import { log } from 'node:console';

import { errorsHandler } from '../../../core/errors/errors.handler';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import { DriverListRequestPayload } from '../request-payloads/driver-list-request.payload';
import { driversQueryService } from '../../application/driver-query.service';
import { DriverSortField } from '../request-payloads/driver-sort-field-enum';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export async function getDriverListHandler(
  req: Request<{}, {}, {}, DriverListRequestPayload>,
  res: Response,
) {
  try {
    // * в req.query остаются сырые параметры запроса (строки)
    const queryInput = setDefaultSortAndPaginationIfNotExist<DriverSortField>(
      req.query,
    );

    const driverListOutput =
      await driversQueryService.getDriverList(queryInput);

    log(
      `Drivers: ${driverListOutput.data.map((item) => item.attributes.name)}`,
    );

    res.status(HTTP_STATUS_CODES.OK_200).json(driverListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
