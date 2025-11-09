import request from 'supertest';
import { Express } from 'express';
import { WithId } from 'mongodb';

import { getDriverDtoUtil } from './get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverTypeOutput } from '../../../drivers/application/output/driver-type.output';
import { DriverCreateTypeInput } from '../../../drivers/routes/request-payloads/create-driver-request.payload';
import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverDtoTypeAttributes } from '../../../drivers/domain/driver-domain-dto-attributes';

export async function createDriverUtil(
  app: Express,
  driverDto?: Partial<DriverDtoTypeAttributes>,
): Promise<WithId<DriverTypeOutput>> {
  const testDriverData: DriverCreateTypeInput = {
    data: {
      type: ResourceEnum.Drivers,
      attributes: { ...getDriverDtoUtil(), ...driverDto },
    },
  };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HTTP_STATUS_CODES.CREATED_201);

  return createdDriverResponse.body;
}

// ? driverDto? - в параметрах приймає input, який ми будемо додавати в основному тесті, при створенні нового драйвера (амперсант "?" означає можемо додавати, а можемо ні).
// ? Partial<DriverTypeAttributes> - дає змогу додавати поля опційно, а не наприклад весь обʼєкт DriverTypeAttributes.
