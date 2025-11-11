import request from 'supertest';
import { Express } from 'express';

import { DriverDtoTypeAttributes } from '../../../drivers/domain/driver-domain-dto-attributes';
import { DriverUpdateTypeInput } from '../../../drivers/routes/request-payloads/update-driver-request.payload';
import { ResourceEnum } from '../../../core/types/resources-enum';
import { getDriverDtoUtil } from './get-driver-dto.util';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export async function updateDriverUtil(
  app: Express,
  driverId: string,
  driverDto?: DriverDtoTypeAttributes,
): Promise<void> {
  const testDriverData: DriverUpdateTypeInput = {
    data: {
      type: ResourceEnum.Drivers,
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
