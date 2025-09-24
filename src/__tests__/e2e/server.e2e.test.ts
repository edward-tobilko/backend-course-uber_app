import express from 'express';
import request from 'supertest';
import { log } from 'node:console';

import { setupApp } from '../../app';
import { DriverInputDto } from '../../drivers/dto/driver-input-dto.type';
import { HTTP_STATUS_CODES } from '../../core/utils/http-statuses';
import { Driver, VehicleFeature } from '../../drivers/types/driver.types';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app); // * подключает все middleware, маршруты и необходимые настройки

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
    // * request(app).delete('') - це типу клієнт робить запит на наший енд поінт delete по цьому урлу '/testing/all-data'
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  it('POST: /drivers -> should create driver', async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
      name: 'Feodor',
      email: 'feodor@example.com',
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

    // log('createResponse ->', createResponse.status, createResponse.body);
    // log('getResponse ->', getResponse.status, getResponse.body);
  });

  it('DELETE: /drivers/:id and check after NOT FOUND', async () => {
    // * 1. створюємо драйвера
    const createDriverResponse = await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    expect(typeof createdDriverId).toBe('number');

    // * 2. Видаляємо
    await request(app)
      .delete(`/drivers/${createdDriverId}`)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    // * 3. Отримуємо відповідь
    const getDiverResponse = await request(app).get(
      `/drivers/${createdDriverId}`,
    );

    expect(getDiverResponse.status).toBe(HTTP_STATUS_CODES.NOT_FOUND_404);
  });

  it('PUT: /drivers/:id should update driver', async () => {
    const createResponse = (await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another driver' })
      .expect(HTTP_STATUS_CODES.CREATED_201)) as request.Response & {
      body: Driver;
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
      .put(`/drivers/${createResponse.body.id}`)
      .send(driverUpdateData)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    const driverResponse = await request(app).get(
      `/drivers/${createResponse.body.id}`,
    );

    expect(driverResponse.body).toEqual({
      ...driverUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });
});
