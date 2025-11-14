import request from 'supertest';
import { Express } from 'express';
import { WithId } from 'mongodb';

import { getDriverDtoUtil } from './get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { DriverOutput } from '../../../drivers/application/output/driver-type.output';
import { CreateDriverRequestPayload } from '../../../drivers/routes/request-payloads/create-driver-request.payload';
import { Resources } from '../../../core/types/resources-enum';
import { DriverDomainDtoAttributes } from '../../../drivers/domain/driver-dto.domain';

export async function createDriverUtil(
  app: Express,
  driverDto?: Partial<DriverDomainDtoAttributes>,
): Promise<WithId<DriverOutput>> {
  const testDriverData: CreateDriverRequestPayload = {
    data: {
      type: Resources.Drivers,
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

// ? driverDto? - в параметрах принимает input, который мы будем добавлять в основном тесте при создании нового драйвера (амперсанд «?» означает, что мы можем добавлять, а можем и нет).
// ? Partial<DriverDomainDtoAttributes> - позволяет добавлять поля опционально, а не, например, весь объект DriverDomainDtoAttributes.
