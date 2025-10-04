import request from 'supertest';
import { Express } from 'express';
import { WithId } from 'mongodb';

import { DriverInputDto } from '../../../drivers/dto/driver-input-dto.type';
import { getDriverDtoUtil } from './get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverViewModelType } from '../../../drivers/types/driver-view-model.types';

export async function createDriverUtil(
  app: Express,
  driverDto?: Partial<DriverInputDto>,
): Promise<WithId<DriverViewModelType>> {
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
