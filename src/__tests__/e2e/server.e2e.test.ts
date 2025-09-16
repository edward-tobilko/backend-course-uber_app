import express from 'express';
import request from 'supertest';
import { log } from 'node:console';

import { setupApp } from '../../app';
import { DriverInputDto } from '../../drivers/dto/driver.input-dto';
import { HTTP_STATUS_CODES } from '../../core/types/http-statuses';
import { Driver } from '../../drivers/types/driver.types';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const testDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  it('POST: /drivers -> should create driver', async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
    };

    await request(app)
      .post('/drivers')
      .send(newDriver)
      .expect(HTTP_STATUS_CODES.CREATED_201);
  });

  it("GET: '/' and '/drivers' -> should return drivers list", async () => {
    await request(app)
      .post('/drivers')
      .send({
        ...testDriverData,
        name: 'Another driver1',
        vehicleLicensePlate: 'XYZ-111',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    await request(app)
      .post('/drivers')
      .send({
        ...testDriverData,
        name: 'Another driver2',
        vehicleLicensePlate: 'XYZ-222',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const driverListResponseRoot = await request(app)
      .get('/')
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(driverListResponseRoot.body).toBeInstanceOf(Array);
    expect(driverListResponseRoot.body.length).toBeGreaterThanOrEqual(2);

    const driverListResponseDrivers = await request(app)
      .get('/drivers')
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(driverListResponseDrivers.body).toBeInstanceOf(Array);
    expect(driverListResponseDrivers.body.length).toBeGreaterThanOrEqual(2);
  });

  it('GET: /drivers/:driverId should return driver by id', async () => {
    const createResponse = (await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201)) as request.Response & {
      body: Driver;
    };

    const getResponse = await request(app)
      .get(`/drivers/${createResponse.body.id}`)
      .expect(HTTP_STATUS_CODES.OK_200);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });

    log('createResponse ->', createResponse.status, createResponse.body);
    log('getResponse ->', getResponse.status, getResponse.body);
  });
});
