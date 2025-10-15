import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { getDriverDtoUtil } from '../../utils/drivers/get-driver-dto.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { clearDB } from '../../utils/clear-db.util';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriverUtil } from '../../utils/drivers/create-driver.util';
import { getDriverByIdUtil } from '../../utils/drivers/get-driver-by-id.util';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';
import { DriverDtoTypeAttributes } from '../../../drivers/application/dto/driver-dto-type-attributes';
import { VehicleFeatureEnum } from '../../../drivers/routes/output/driver-data-type.output';
import { updateDriverUtil } from '../../utils/drivers/update-driver.util';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app); // * подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /api/drivers -> should create new driver - 201', async () => {
    await createDriverUtil(app, {
      ...getDriverDtoUtil(),
      name: 'Feodor',
      email: 'feodor@example.com',
    });
  });

  it('GET: /api/drivers -> should return drivers list - 200', async () => {
    await Promise.all([
      createDriverUtil(app, {
        name: 'Another driver1',
        vehicleLicensePlate: 'XYZ-111',
      }),
      createDriverUtil(app, {
        name: 'Another driver2',
        vehicleLicensePlate: 'XYZ-222',
      }),
    ]);

    const driversListResponse = await request(app)
      .get(DRIVERS_PATH)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(driversListResponse.body.data).toBeInstanceOf(Array);
    expect(driversListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('GET: /api/drivers/:id should return driver by id - 200', async () => {
    const createdDriver = await createDriverUtil(app, {
      name: 'Another Driver',
    });

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createdDriver.data.id,
    );

    expect(getDriverByIdResponse).toEqual({
      ...createdDriver,
    });
  });

  it('DELETE: /api/drivers/:id and check after NOT FOUND - 404 and 204', async () => {
    // * 1. створюємо драйвера
    const createdDriver = await createDriverUtil(app);

    expect(typeof createdDriver.data.id).toBe('string');

    // * 2. Видаляємо
    await request(app)
      .delete(`${DRIVERS_PATH}/${createdDriver.data.id}`)
      .set('Authorization', adminToken)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    // * 3. Отримуємо відповідь
    await request(app)
      .get(`${DRIVERS_PATH}/${createdDriver.data.id}`)
      .expect(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  it('PUT: /api/drivers/:id should update driver - 200 and 204', async () => {
    const createdDriver = await createDriverUtil(app, {
      name: 'Another Driver',
    });

    const driverUpdateData: DriverDtoTypeAttributes = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeatureEnum.ChildSeat],
    };

    await updateDriverUtil(app, createdDriver.data.id, driverUpdateData);

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createdDriver.data.id,
    );

    expect(getDriverByIdResponse.data.id).toBe(createdDriver.data.id);
    expect(getDriverByIdResponse.data.attributes).toEqual({
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
