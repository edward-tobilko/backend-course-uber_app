import request from 'supertest';
import { Express } from 'express';

import { RIDES_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { getRideDtoUtil } from './get-ride-dto.util';
import { RideInputDtoType } from '../../../rides/dto/ride-input-dto.types';
import { createDriverUtil } from '../drivers/create-driver.util';
import { RideType } from '../../../rides/types/ride.types';
import { DriverType } from '../../../drivers/types/driver.types';

export async function createRideUtil(
  app: Express,
  rideDto?: Partial<RideInputDtoType>,
): Promise<RideType> {
  const driver: DriverType = await createDriverUtil(app);

  const defaultRideDataDto: RideInputDtoType = getRideDtoUtil(driver.id);

  const rideDataDto = { ...defaultRideDataDto, ...rideDto };

  const createdRideResponse = await request(app)
    .post(RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(rideDataDto)
    .expect(HTTP_STATUS_CODES.CREATED_201);

  return createdRideResponse.body;
}

// ? rideDto? - в параметрах приймає input, який ми будемо додавати в основному тесті, при створенні новоі поіздки (амперсант "?" означає можемо додавати, а можемо ні).
// ? Partial<RideInputDtoType> - дає змогу додавати поля опційно, а не наприклад весь обʼєкт RideInputDtoType.
