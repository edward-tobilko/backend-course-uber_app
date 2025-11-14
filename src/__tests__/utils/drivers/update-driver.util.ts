import request from 'supertest';
import { Express } from 'express';

import { DriverDomainDtoAttributes } from '../../../drivers/domain/driver-dto.domain';
import { UpdateDriverRequestPayload } from '../../../drivers/routes/request-payloads/update-driver-request.payload';
import { Resources } from '../../../core/types/resources-enum';
import { getDriverDtoUtil } from './get-driver-dto.util';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export async function updateDriverUtil(
  app: Express,
  driverId: string,
  driverDto?: DriverDomainDtoAttributes,
): Promise<void> {
  const testDriverData: UpdateDriverRequestPayload = {
    data: {
      type: Resources.Drivers,
      id: driverId,
      attributes: { ...getDriverDtoUtil(), ...driverDto },
    },
  };

  const updatedDriverResponse = await request(app)
    .put(`${DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

  return updatedDriverResponse.body;
}
