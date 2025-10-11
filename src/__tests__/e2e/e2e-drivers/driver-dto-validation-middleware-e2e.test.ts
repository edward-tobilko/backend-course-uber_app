import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { DriverInputDto } from '../../../drivers/application/dto/driver-attributes';
import { VehicleFeature } from '../../../drivers/types/driver.types';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { clearDB } from '../../utils/clear-db.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriverUtil } from '../../utils/drivers/create-driver.util';
import { getDriverByIdUtil } from '../../utils/drivers/get-driver-by-id.util';
import { getDriverDtoUtil } from '../../utils/drivers/get-driver-dto.util';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  const correctTestDriverData: DriverInputDto = getDriverDtoUtil();

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /drivers -> should not create driver when incorrect body passed - 401 and 400', async () => {
    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '     ',
        phoneNumber: '   ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A', // too short
      });

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    // * проверяем никто ли не создался
    const driverListResponse = await request(app).get(DRIVERS_PATH);

    expect(driverListResponse.body).toHaveLength(0);
  });

  it('PUT: /drivers/:id should not update driver when incorrect data passed - 401 and 400', async () => {
    const createDriverResponse = await createDriverUtil(
      app,
      correctTestDriverData,
    );
    const id = createDriverResponse.id;

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '     ',
        phoneNumber: '   ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '', // empty string
        vehicleModel: '', // empty string
        vehicleYear: 'year', // incorrect number
        vehicleLicensePlate: '', // empty string
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`${DRIVERS_PATH}/${id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A', //too short
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await getDriverByIdUtil(app, id);

    expect(driverResponse).toEqual({
      ...createDriverResponse,
    });
  });

  it('PUT: /drivers/:id should not update driver when incorrect features passed', async () => {
    const createDriverResponse = await createDriverUtil(
      app,
      correctTestDriverData,
    );

    await request(app)
      .put(`${DRIVERS_PATH}/${createDriverResponse.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        vehicleFeatures: [
          VehicleFeature.ChildSeat,
          'Invalid feature',
          VehicleFeature.WiFi,
        ],
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createDriverResponse.id,
    );

    expect(getDriverByIdResponse).toEqual({
      ...createDriverResponse,
    });
  });
});
