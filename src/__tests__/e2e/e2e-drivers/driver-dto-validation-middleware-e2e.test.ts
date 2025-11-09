import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { clearDB } from '../../utils/clear-db.util';
import { DRIVERS_PATH } from '../../../core/paths/paths';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { createDriverUtil } from '../../utils/drivers/create-driver.util';
import { getDriverByIdUtil } from '../../utils/drivers/get-driver-by-id.util';
import { getDriverDtoUtil } from '../../utils/drivers/get-driver-dto.util';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';
import { DriverDtoTypeAttributes } from '../../../drivers/domain/driver-domain-dto-attributes';
import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverCreateTypeInput } from '../../../drivers/routes/request-payloads/create-driver-request.payload';
import { DriverUpdateTypeInput } from '../../../drivers/routes/request-payloads/update-driver-request.payload';
import { VehicleFeatureEnum } from '../../../drivers/application/output/driver-data-type.output';

describe('Driver API body validation check', () => {
  const app = express();
  setupApp(app); // подключает все middleware, маршруты и необходимые настройки

  const adminToken = generateBasicAuthToken();

  const correctTestDriverAttributes: DriverDtoTypeAttributes =
    getDriverDtoUtil();

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /api/drivers -> should not create driver when incorrect body passed - 401 and 400', async () => {
    const correctTestDriverData: DriverCreateTypeInput = {
      data: {
        type: ResourceEnum.Drivers,
        attributes: correctTestDriverAttributes,
      },
    };

    await request(app)
      .post(DRIVERS_PATH)
      .send(correctTestDriverData)
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    const invalidDataSet1 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: '   ', // empty string
            phoneNumber: '    ', // empty string
            email: 'invalid email', // incorrect email
            vehicleMake: '', // empty string
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Feodor',
            phoneNumber: '', // empty string
            email: 'feodor@example.com',
            vehicleModel: '', // empty string
            vehicleLicensePlate: '', // empty string
            vehicleMake: '', // empty string
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errors).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Feodor',
            email: 'feodor@example.com',
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleLicensePlate: '', // empty string
            vehicleMake: '', // empty string
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      });

    expect(invalidDataSet3.body.errors).toHaveLength(4);

    // * проверяем никто ли не создался
    const driverListResponse = await request(app).get(DRIVERS_PATH);

    expect(driverListResponse.body.data).toHaveLength(0);
  });

  it('PUT: /api/drivers/:id should not update driver when incorrect data passed - 401 and 400', async () => {
    const createdDriver = await createDriverUtil(
      app,
      correctTestDriverAttributes,
    );
    const createdDriverId = createdDriver.data.id;

    const correctTestDriverData: DriverUpdateTypeInput = {
      data: {
        type: ResourceEnum.Drivers,
        id: createdDriverId,
        attributes: correctTestDriverAttributes,
      },
    };

    const invalidDataSet1 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: '   ', // spaces
            phoneNumber: '    ', // spaces
            email: 'invalid email', // invalid email
            vehicleMake: '', // empty string
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Ted',
            email: 'ted@example.com',
            vehicleMake: 'Audi',
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
            phoneNumber: '', // empty string
            vehicleModel: '', // empty string
            vehicleLicensePlate: '', // empty string
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errors).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`${DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'A', //too short
            phoneNumber: '987-654-3210',
            email: 'feodor@example.com',
            vehicleMake: 'Audi',
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errors).toHaveLength(1);

    const driverResponse = await getDriverByIdUtil(app, createdDriverId);

    expect(driverResponse).toEqual({
      ...createdDriver,
    });
  });

  it('PUT: /api/drivers/:id should not update driver when incorrect features passed', async () => {
    const createdDriver = await createDriverUtil(
      app,
      correctTestDriverAttributes,
    );

    const correctTestDriverData: DriverUpdateTypeInput = {
      data: {
        type: ResourceEnum.Drivers,
        id: createdDriver.data.id,
        attributes: correctTestDriverAttributes,
      },
    };

    await request(app)
      .put(`${DRIVERS_PATH}/${createdDriver.data.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData.data,
        attributes: {
          name: 'Ted',
          phoneNumber: '987-654-3210',
          email: 'ted@example.com',
          vehicleMake: 'Audi',
          vehicleModel: 'A6',
          vehicleYear: 2020,
          vehicleLicensePlate: 'XYZ-456',
          vehicleDescription: null,
          vehicleFeatures: [
            VehicleFeatureEnum.ChildSeat,
            'invalid-feature' as VehicleFeatureEnum, // invalid string
            VehicleFeatureEnum.WiFi,
          ],
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    const getDriverByIdResponse = await getDriverByIdUtil(
      app,
      createdDriver.data.id,
    );

    expect(getDriverByIdResponse).toEqual({
      ...createdDriver,
    });
  });
});
