import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { DriverInputDto } from '../../../drivers/application/dto/driver-dto-type-attributes';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { VehicleFeature } from '../../../drivers/types/driver.types';
import { getDriverDtoUtil } from '../../utils/drivers/get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { clearDB } from '../../utils/clear-db.util';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriverUtil } from '../../utils/drivers/create-driver.util';
import { getDriverByIdUtil } from '../../utils/drivers/get-driver-by-id.util';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app); // * подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  const correctTestDriverData: DriverInputDto = getDriverDtoUtil();

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /drivers -> should create new driver - 201', async () => {
    const newDriver: DriverInputDto = {
      ...correctTestDriverData,
      name: 'Feodor',
      email: 'feodor@example.com',
    };

    await createDriverUtil(app, newDriver);
  });

  it('GET: /drivers -> should return drivers list - 200', async () => {
    await createDriverUtil(app, {
      name: 'Another driver1',
      vehicleLicensePlate: 'XYZ-111',
    });
    await createDriverUtil(app, {
      name: 'Another driver2',
      vehicleLicensePlate: 'XYZ-222',
    });

    const driverListResponseDrivers = await request(app)
      .get(DRIVERS_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(driverListResponseDrivers.body).toBeInstanceOf(Array);
    expect(driverListResponseDrivers.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET: /drivers/:id should return driver by id - 200', async () => {
    const createdDriver = await createDriverUtil(app, {
      name: 'Another Driver',
    });

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createdDriver.id,
    );

    expect(getDriverByIdResponse).toEqual({
      ...createdDriver,
      id: expect.any(String),
      createdAt: expect.any(String),
    });

    // log('createResponse ->', createResponse.status, createResponse.body);
    // log('getResponse ->', getResponse.status, getResponse.body);
  });

  it('DELETE: /drivers/:id and check after NOT FOUND - 404 and 204', async () => {
    // * 1. створюємо драйвера
    const createdDriver = await createDriverUtil(app);

    expect(typeof createdDriver.id).toBe('string');

    // * 2. Видаляємо
    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    // * 3. Отримуємо відповідь
    await request(app)
      .get(`${DRIVERS_PATH}/${createdDriver.id}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  it('PUT: /drivers/:id should update driver - 200 and 204', async () => {
    const createdDriver = await createDriverUtil(app, {
      name: 'Another Driver',
    });

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
      .put(`${DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .send(driverUpdateData)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createdDriver.id,
    );

    expect(getDriverByIdResponse).toEqual({
      id: createdDriver.id,
      name: driverUpdateData.name,
      phoneNumber: driverUpdateData.phoneNumber,
      email: driverUpdateData.email,
      vehicle: {
        description: driverUpdateData.vehicleDescription,
        features: driverUpdateData.vehicleFeatures,
        licensePlate: driverUpdateData.vehicleLicensePlate,
        make: driverUpdateData.vehicleMake,
        model: driverUpdateData.vehicleModel,
        year: driverUpdateData.vehicleYear,
      },
      createdAt: expect.any(String),
    });
  });
});
