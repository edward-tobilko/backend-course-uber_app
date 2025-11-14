import request from 'supertest';
import { Express } from 'express';

import { RIDES_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { getRideDtoUtil } from './get-ride-dto.util';
import { createDriverUtil } from '../drivers/create-driver.util';
import { RideOutput } from '../../../rides/application/output/ride-type.output';
import { Resources } from '../../../core/types/resources-enum';
import { CreateRideDtoCommand } from '../../../rides/application/commands/ride-dto-type.commands';

export async function createRideUtil(
  app: Express,
  rideDto?: Partial<CreateRideDtoCommand>,
): Promise<RideOutput> {
  const driver = await createDriverUtil(app);

  const defaultRideDataDto = getRideDtoUtil(driver.data.id);

  const testRideData = {
    data: {
      type: Resources.Rides,
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

// ? rideDto? — в параметрах принимает input, который мы будем добавлять в основном тесте при создании новой поездки (амперсанд «?» означает, что мы можем добавлять, а можем и нет).
// ? Partial<CreateRideDtoCommand> — позволяет добавлять поля опционально, а не, например, весь объект CreateRideDtoCommand.
