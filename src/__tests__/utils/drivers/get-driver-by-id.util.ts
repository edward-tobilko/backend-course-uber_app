import request from 'supertest';
import { Express } from 'express';

import { DRIVERS_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverTypeOutput } from '../../../drivers/routes/output/driver-type.output';

export async function getDriverByIdUtil(
  app: Express,
  driverId: string,
): Promise<DriverTypeOutput> {
  const fetchedDriverByIdResponse = await request(app)
    .get(`${DRIVERS_PATH}/${driverId}`)
    .expect(HTTP_STATUS_CODES.OK_200);

  return fetchedDriverByIdResponse.body;
}
