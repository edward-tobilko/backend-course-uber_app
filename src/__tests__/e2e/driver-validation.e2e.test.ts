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
});
