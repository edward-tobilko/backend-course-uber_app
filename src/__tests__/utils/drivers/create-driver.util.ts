import request from 'supertest';
import { Express } from 'express';
import { WithId } from 'mongodb';

import { getDriverDtoUtil } from './get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverTypeAttributes } from '../../../drivers/routes/output/driver-data-type.output';
import { DriverTypeOutput } from '../../../drivers/routes/output/driver-type.output';
import { DriverCreateTypeInput } from '../../../drivers/routes/input/driver-create-type.input';
import { ResourceEnum } from '../../../core/types/resource-enum';

export async function createDriverUtil(
  app: Express,
  driverDto?: Partial<DriverTypeAttributes>,
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
