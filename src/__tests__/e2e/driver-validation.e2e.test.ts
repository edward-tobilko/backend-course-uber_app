import express from 'express';
import request from 'supertest';

import { setupApp } from '../../app';
import { DriverInputDto } from '../../drivers/dto/driver.input-dto';
import { VehicleFeature } from '../../drivers/types/driver.types';

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

  it('should not create driver when incorrect body passed; POST /drivers', async () => {
    await request(app);
  });
});
