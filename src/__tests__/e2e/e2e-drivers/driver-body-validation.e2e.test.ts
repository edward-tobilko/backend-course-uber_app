import { getDriverDto } from './../../utils/drivers/get-driver-dto.util';
import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { DriverInputDto } from '../../../drivers/dto/driver-input-dto.type';
import { VehicleFeature } from '../../../drivers/types/driver.types';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { clearDB } from '../../utils/clear-db.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  const correctTestDriverData: DriverInputDto = getDriverDto();

  beforeAll(async () => {
    await clearDB(app);
  });

  it('POST: /drivers -> should not create driver when incorrect body passed', async () => {
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
    const driverListResponse = await request(app).get('/drivers');

    expect(driverListResponse.body).toHaveLength(0);
  });

  it('PUT: /drivers/:id should not update driver when incorrect data passed', async () => {
    const createDriverResponse = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
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
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
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
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A', //too short
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app).get(
      `${DRIVERS_PATH}/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });

  it('PUT: /drivers/:id should not update driver when incorrect features passed', async () => {
    const createDriverResponse = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({ ...correctTestDriverData })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
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

    const driverResponse = await request(app).get(
      `${DRIVERS_PATH}/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });
});
