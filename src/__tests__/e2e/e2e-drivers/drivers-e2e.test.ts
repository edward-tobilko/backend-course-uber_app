import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { DriverInputDto } from '../../../drivers/dto/driver-input-dto.type';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import {
  DriverType,
  VehicleFeature,
} from '../../../drivers/types/driver.types';
import { getDriverDto } from '../../utils/drivers/get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { clearDB } from '../../utils/clear-db.util';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app); // * подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  const correctTestDriverData: DriverInputDto = getDriverDto();

  beforeAll(async () => {
    await clearDB(app);
  });

  it('POST: /drivers -> should create driver', async () => {
    const newDriver: DriverInputDto = {
      ...correctTestDriverData,
      name: 'Feodor',
      email: 'feodor@example.com',
    };

    await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send(newDriver)
      .expect(HTTP_STATUS_CODES.CREATED_201);
  });

  it('GET: /drivers -> should return drivers list', async () => {
    await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'Another driver1',
        vehicleLicensePlate: 'XYZ-111',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'Another driver2',
        vehicleLicensePlate: 'XYZ-222',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const driverListResponseDrivers = await request(app)
      .get(DRIVERS_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(driverListResponseDrivers.body).toBeInstanceOf(Array);
    expect(driverListResponseDrivers.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET: /drivers/:id should return driver by id', async () => {
    const createResponse = (await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData, name: 'Another driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201)) as request.Response & {
      body: DriverType;
    };

    const getResponse = await request(app)
      .get(`${DRIVERS_PATH}/${createResponse.body.id}`)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });

    // log('createResponse ->', createResponse.status, createResponse.body);
    // log('getResponse ->', getResponse.status, getResponse.body);
  });

  it('DELETE: /drivers/:id and check after NOT FOUND', async () => {
    // * 1. створюємо драйвера
    const createDriverResponse = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData, name: 'Another Driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    expect(typeof createdDriverId).toBe('number');

    // * 2. Видаляємо
    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    // * 3. Отримуємо відповідь
    const getDiverResponse = await request(app).get(
      `${DRIVERS_PATH}/${createdDriverId}`,
    );

    expect(getDiverResponse.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  it('PUT: /drivers/:id should update driver', async () => {
    const createResponse = (await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData, name: 'Another driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201)) as request.Response & {
      body: DriverType;
    };

    const driverUpdateData: DriverInputDto = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await request(app)
      .put(`${DRIVERS_PATH}/${createResponse.body.id}`)
      .set('Authorization', adminToken)
      .send(driverUpdateData)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    const driverResponse = await request(app).get(
      `${DRIVERS_PATH}/${createResponse.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...driverUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });
});
