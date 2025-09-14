import express from 'express';
import request from 'supertest';

import { setupApp } from '../../app';
import { DriverInputDto } from '../../drivers/dto/driver.input-dto';
import { HTTP_STATUS_CODES } from '../../core/types/http-statuses';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app);

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
    await request(app)
      .post('/drivers')
      .send({
        ...testDriverData,
        name: 'Valentin',
        phoneNumber: '123-456-7890',
        email: 'valentin@example.com',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);
  });

  it("GET: '/' and '/drivers' -> should return drivers list", async () => {
    await request(app)
      .post('/drivers')
      .send({
        ...testDriverData,
        name: 'Another driver 1',
        vehicleLicensePlate: 'XYZ-111',
      })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    await request(app)
      .post('/drivers')
      .send({
        ...testDriverData,
        name: 'Another driver 2',
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
});
