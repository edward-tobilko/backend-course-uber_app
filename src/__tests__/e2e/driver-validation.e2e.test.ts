import express from 'express';
import request from 'supertest';

import { setupApp } from '../../app';
import { DriverInputDto } from '../../drivers/dto/driver.input-dto';
import { VehicleFeature } from '../../drivers/types/driver.types';
import { HTTP_STATUS_CODES } from '../../core/types/http-statuses';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const correctTestDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: 'Some description',
    vehicleFeatures: [VehicleFeature.ChildSeat],
  };

  beforeAll(async () => {
    // * request(app).delete('') - це типу клієнт робить запит на наший енд поінт delete по цьому урлу '/testing/all-data'
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);
  });

  it('POST: /drivers -> should not create driver when incorrect body passed', async () => {
    const invalidDataSet1 = await request(app)
      .post('/drivers')
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
      .post('/drivers')
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
      .post('/drivers')
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
      .post('/drivers')
      .send({ ...correctTestDriverData })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    const invalidDataSet1 = await request(app)
      .put(`/drivers/${createdDriverId}`)
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
      .put(`/drivers/${createdDriverId}`)
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
      .put(`/drivers/${createdDriverId}`)
      .send({
        ...correctTestDriverData,
        name: 'A', //too short
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const driverResponse = await request(app).get(
      `/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });

  it('PUT: /drivers/:id should not update driver when incorrect features passed', async () => {
    const createDriverResponse = await request(app)
      .post('/drivers')
      .send({ ...correctTestDriverData })
      .expect(HTTP_STATUS_CODES.CREATED_201);

    const createdDriverId = createDriverResponse.body.id;

    await request(app)
      .put(`/drivers/${createdDriverId}`)
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
      `/drivers/${createdDriverId}`,
    );

    expect(driverResponse.body).toEqual({
      ...correctTestDriverData,
      id: createdDriverId,
      createdAt: expect.any(String),
    });
  });
});
