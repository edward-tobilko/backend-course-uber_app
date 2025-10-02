import request from 'supertest';
import { Express } from 'express';

import { DriverInputDto } from '../../../drivers/dto/driver-input-dto.type';
import { getDriverDtoUtil } from './get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverType } from '../../../drivers/types/driver.types';

export async function createDriverUtil(
  app: Express,
  driverDto?: Partial<DriverInputDto>,
): Promise<DriverType> {
  const defaultDriverDataDto: DriverInputDto = getDriverDtoUtil();
  const driverDataDto = { ...defaultDriverDataDto, ...driverDto };

  const createdDriverResponse = await request(app)
    .post(DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(driverDataDto)
    .expect(HTTP_STATUS_CODES.CREATED_201);

  return createdDriverResponse.body;
}

// ? driverDto? - в параметрах приймає input, який ми будемо додавати в основному тесті, при створенні нового драйвера (амперсант "?" означає можемо додавати, а можемо ні).
// ? Partial<DriverInputDto> - дає змогу додавати поля опційно, а не наприклад весь обʼєкт DriverInputDto.
