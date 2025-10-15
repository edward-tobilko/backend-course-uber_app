import { Request, Response } from 'express';
import { log } from 'node:console';
import { matchedData } from 'express-validator';

import { DriverQueryTypeInput } from '../input/driver-query-type.input';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { driversService } from '../../application/drivers.service';
import { mapToDriverListPaginatedOutput } from '../mappers/map-to-driver-list-paginated-output.mapper';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';

export async function getDriverListHandler(
  req: Request<{}, {}, DriverQueryTypeInput>,
  res: Response,
) {
  try {
    // * утиліта для вилучення трансформованих значень після валідатора
    const sanitizedQuery = matchedData<DriverQueryTypeInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    // * в req.query залишаються сирі параметри запиту (рядки)
    const queryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

    const { items, totalCount } = await driversService.findAll(queryInput);

    log(
      `Drivers: ${items.map((item) => item.name)} - Total: ${totalCount.toString()}`,
    );

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    res.json(driversListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
