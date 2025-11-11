import express from 'express';
import request from 'supertest';

import { setupApp } from '../../../app';
import { clearDB } from '../../utils/clear-db.util';
import { RIDES_PATH } from '../../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { runDB, stopDB } from '../../../db/mongo.db';
import { SETTINGS_MONGO_DB } from '../../../core/settings-mongoDB/settings-mongo.db';
import { ResourceEnum } from '../../../core/types/resources-enum';
import { CurrencyEnum } from '../../../rides/application/output/ride-data-type.output';
import { createRideUtil } from '../../utils/rides/create-ride.uti';

describe('Ride API body validation check', () => {
  const app = express();

  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS_MONGO_DB.MONGO_URL);
    await clearDB(app);
  });

  afterAll(async () => {
    await stopDB();
  });

  it('POST: /api/rides -> should not create driver when incorrect body passed - 401 and 400', async () => {
    await request(app)
      .post(RIDES_PATH)
      .send({})
      .expect(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    const invalidDataSet1 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          type: ResourceEnum.Rides,
          attributes: {
            clientName: '   ', // empty string
            price: 'bla bla', // not a number
            currency: 1, // not a string
            fromAddress: '', // empty string
            toAddress: true, // not a string
            driverId: 'bam', //not a number
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errors).toHaveLength(6);

    const invalidDataSet2 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          type: ResourceEnum.Rides,
          attributes: {
            clientName: 'LA', // short string
            price: 0, // can not be 0
            currency: 'byn', // not in Currency
            fromAddress: 'street', // short string
            driverId: 0, //can not be 0
            toAddress: 'test address',
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errors).toHaveLength(5);

    const invalidDataSet3 = await request(app)
      .post(RIDES_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          type: ResourceEnum.Rides,
          attributes: {
            driverId: 5000, //driver should exist
            clientName: 'Sam',
            price: 100,
            currency: CurrencyEnum.USD,
            fromAddress: 'test address',
            toAddress: 'test address',
          },
        },
      })
      .expect(HTTP_STATUS_CODES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errors).toHaveLength(1);

    // * check что никто не создался
    const emptyRideListResponse = await request(app).get(RIDES_PATH);

    expect(emptyRideListResponse.body.data).toHaveLength(0);
  });

  it('POST: /api/rides/:id/actions/finish -> should not finish ride when ride already been finished - 204 and 422', async () => {
    const createdRide = await createRideUtil(app);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.data.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

    await request(app)
      .post(`${RIDES_PATH}/${createdRide.data.id}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY_422);
  });
});
