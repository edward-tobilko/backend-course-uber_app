import request from 'supertest';
import { Express } from 'express';

import { RideType } from '../../../rides/types/ride.types';
import { RIDES_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';

export async function getRideByIdUtil(
  app: Express,
  rideId: number,
): Promise<RideType> {
  const createdRideResponse = await request(app)
    .get(`${RIDES_PATH}/${rideId}`)
    .expect(HTTP_STATUS_CODES.OK_200);

  return createdRideResponse.body;
}
