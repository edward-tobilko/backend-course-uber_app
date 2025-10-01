import request from 'supertest';
import { Express } from 'express';

import { TESTING_PATH } from '../../core/paths/paths';
import { HTTP_STATUS_CODES } from '../../core/utils/http-statuses';

export const clearDB = async (app: Express) => {
  await request(app)
    .delete(TESTING_PATH)
    .expect(HTTP_STATUS_CODES.NO_CONTENT_204);

  return;
};

// ? request(app).delete('') - це типу клієнт робить запит на наший енд поінт delete по цьому урлу '/testing/all-data'
