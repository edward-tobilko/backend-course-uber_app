import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { clearDB } from '../../utils/clear-db.util';
import { createRideUtil } from '../../utils/rides/create-ride.uti';
import { RIDES_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { RideType } from '../../../rides/types/ride.types';
import { getRideByIdUtil } from '../../utils/rides/get-ride-by-id.util';

describe('E2E rides API tests', () => {
  const app = express();

  setupApp(app);

  beforeAll(async () => {
    await clearDB(app);
  });

  it('POST: /rides -> should create new ride - 201', async () => {
    await createRideUtil(app, { clientName: 'Max', price: 10 });
  });

  it('GET: /rides -> should return rides list - 200', async () => {
    await createRideUtil(app, {
      clientName: 'Another client1',
      price: 20,
    });

    await createRideUtil(app, {
      clientName: 'Another client2',
      price: 30,
    });

    const getRideListResponse = await request(app)
      .get(RIDES_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(getRideListResponse.body).toBeInstanceOf(Array);
    expect(getRideListResponse.body).toHaveLength(3); // 3 - тому що ще один сидить в нашій ф-і createRideUtil (ми його там створили)
  });

  it('GET: /rides/:id -> should return ride by id - 200', async () => {
    const createdNewRideResponse: RideType = await createRideUtil(app);

    const getRideById = await getRideByIdUtil(app, createdNewRideResponse.id);

    expect(getRideById).toEqual({
      ...createdNewRideResponse,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });
});
