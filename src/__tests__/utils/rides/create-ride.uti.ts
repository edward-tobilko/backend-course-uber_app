import request from 'supertest';
import { Express } from 'express';

import { RIDES_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { getRideDtoUtil } from './get-ride-dto.util';
import { createDriverUtil } from '../drivers/create-driver.util';
import { RideDtoTypeAttributes } from '../../../rides/application/dto/ride-dto-type.attributes';
import { RideTypeOutput } from '../../../rides/routes/output/ride-type.output';
import { ResourceEnum } from '../../../core/types/resource-enum';

export async function createRideUtil(
  app: Express,
  rideDto?: Partial<RideDtoTypeAttributes>,
): Promise<RideTypeOutput> {
  const driver = await createDriverUtil(app);

  const defaultRideDataDto = getRideDtoUtil(driver.data.id);

  const testRideData = {
    data: {
      type: ResourceEnum.Rides,
      attributes: { ...defaultRideDataDto, ...rideDto },
    },
  };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HTTP_STATUS_CODES.CREATED_201);

  return createdRideResponse.body;
}

// ? rideDto? - в параметрах приймає input, який ми будемо додавати в основному тесті, при створенні нової поїздки (амперсант "?" означає можемо додавати, а можемо ні).
// ? Partial<RideDtoTypeAttributes> - дає змогу додавати поля опційно, а не наприклад весь обʼєкт RideDtoTypeAttributes.
