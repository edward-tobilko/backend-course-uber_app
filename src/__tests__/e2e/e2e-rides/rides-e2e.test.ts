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

  it('POST: /api/rides -> should create new ride - 201', async () => {
    await createRideUtil(app);
  });

  it('GET: /api/rides -> should return rides list - 200', async () => {
    await createRideUtil(app);

    const getRideListResponse = await request(app)
      .get(RIDES_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(getRideListResponse.body.data).toBeInstanceOf(Array);
    expect(getRideListResponse.body.data).toHaveLength(2); // створилося 2 поїздки, тому що одна у нас в createRideUtil лежить
  });

  it('GET: /api/rides/:id -> should return ride by id - 200', async () => {
    const createdRideResponse = await createRideUtil(app);

    const getRideById = await getRideByIdUtil(app, createdRideResponse.data.id);

    expect(getRideById.data.id).toBe(createdRideResponse.data.id);
    expect(getRideById.data.attributes).toEqual(
      createdRideResponse.data.attributes,
    );
  });

  it('POST: /api/rides/:id/actions/finish -> should finish ride - 204', async () => {
    const createdRide = await createRideUtil(app);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.data.id}/actions/finish`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    const fetchedRideById = await getRideByIdUtil(app, createdRide.data.id);

    expect(fetchedRideById.data.id).toBe(createdRide.data.id);
    expect(fetchedRideById.data.attributes).toEqual({
      ...createdRide.data.attributes,
      finishedAt: expect.any(String),
    });
  });
});
