import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { clearDB } from '../../utils/clear-db.util';
import { createRideUtil } from '../../utils/rides/create-ride.uti';
import { RIDES_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { getRideByIdUtil } from '../../utils/rides/get-ride-by-id.util';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';
import { RideViewModelType } from '../../../rides/types/ride-view-model.types';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('E2E rides API tests', () => {
  const app = express();

  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /rides -> should create new ride - 201', async () => {
    await createRideUtil(app, { clientName: 'Max', price: 10 });
  });

  it('GET: /rides -> should return rides list - 200', async () => {
    await createRideUtil(app, {
      clientName: 'Another client1',
      price: 20,
    });

    const getRideListResponse = await request(app)
      .get(RIDES_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(getRideListResponse.body).toBeInstanceOf(Array);
    expect(getRideListResponse.body).toHaveLength(2);
  });

  it('GET: /rides/:id -> should return ride by id - 200', async () => {
    const createdNewRideResponse: RideViewModelType = await createRideUtil(app);

    const getRideById = await getRideByIdUtil(app, createdNewRideResponse.id);

    expect(getRideById).toEqual({
      ...createdNewRideResponse,
      id: expect.any(String),
      startedAt: expect.any(String),
      finishedAt: null,
    });
  });

  it('POST: /rides/:id/actions/finish -> should finish ride - 204', async () => {
    const createdRide: RideViewModelType = await createRideUtil(app);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.id}/actions/finish`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    const fetchedRide = await getRideByIdUtil(app, createdRide.id);

    expect(fetchedRide).toEqual({
      ...createdRide,
      finishedAt: expect.any(String),
    });
  });
});
