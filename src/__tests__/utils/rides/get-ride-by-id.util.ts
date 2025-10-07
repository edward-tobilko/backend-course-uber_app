import request from 'supertest';
import { Express } from 'express';

import { RIDES_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { RideViewModelType } from '../../../rides/types/ride-view-model.types';

export async function getRideByIdUtil(
  app: Express,
  rideId: string,
): Promise<RideViewModelType> {
  const fetchedRideById = await request(app)
    .get(`${RIDES_PATH}/${rideId}`)
    .expect(HTTP_STATUS_CODES.OK_200);

  return fetchedRideById.body;
}
