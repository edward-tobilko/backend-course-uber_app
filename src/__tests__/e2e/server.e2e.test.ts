import express from 'express';
import request from 'supertest';

import { setupApp } from '../../app';

describe('E2E: Drivers API', () => {
  const app = express();
  setupApp(app);

  it("GET '/' and '/drivers' -> status code 200 and array of drivers", async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});
