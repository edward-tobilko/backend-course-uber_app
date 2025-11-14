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
import { Resources } from '../../../core/types/resources-enum';

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
    expect(getRideListResponse.body.data).toHaveLength(2); // создалось 2 поездки, потому что одна у нас в createRideUtil
  });

  it('GET: /api/rides/:id -> should return ride by id - 200', async () => {
    const createdRideResponse = await createRideUtil(app);

    const getRide = await getRideByIdUtil(app, createdRideResponse.data.id);

    expect(getRide.data.id).toBe(createdRideResponse.data.id);
    expect(getRide).toEqual({
      data: {
        type: Resources.Rides,
        id: expect.any(String),
        attributes: expect.objectContaining({
          clientName: expect.any(String),
          driver: {
            id: expect.any(String),
            name: expect.any(String),
          },
          vehicle: {
            name: expect.any(String),
            licensePlate: expect.any(String),
          },
          price: expect.any(Number),
          currency: expect.any(String),
          startedAt: expect.any(String),
          finishedAt: null,
          addresses: {
            from: expect.any(String),
            to: expect.any(String),
          },
        }),
      },
    });
  });

  it('POST: /api/rides/:id/actions/finish -> should finish ride - 204', async () => {
    // * 1 - Создаем поездку
    const createdRide = await createRideUtil(app);

    // * 2 - Извлекаем актуальные атрибуты перед финишем (через GET)
    const before = await getRideByIdUtil(app, createdRide.data.id);

    // * 3 - Финишируем поездку
    await request(app)
      .post(`${RIDES_PATH}/${createdRide.data.id}/actions/finish`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    // * 4 - Читаем снова
    const after = await getRideByIdUtil(app, createdRide.data.id);

    // * 5 - Проверяем
    expect(after.data.id).toBe(createdRide.data.id);
    expect(after.data.attributes).toEqual({
      ...before.data.attributes,
      finishedAt: expect.any(String),
    });

    // * 6 - Опционально: проверяем, что это ISO строка
    expect(new Date(after.data.attributes.finishedAt!).getTime()).not.toBeNaN();
  });
});
