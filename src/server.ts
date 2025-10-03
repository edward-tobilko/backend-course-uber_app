import express from 'express';

import { setupApp } from './app';
import { SETTINGS_MONGO_DB } from './core/settings-mongoDB/settings-mongo.db';
import { runDB } from './db/mongo.db';

const bootstrap = async () => {
  const app = express();
  setupApp(app); // * навешиваем middleware and routes

  const PORT = SETTINGS_MONGO_DB.PORT;

  await runDB(SETTINGS_MONGO_DB.MONGO_URL);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  console.log('ENTRY:', __filename);

  return app;
};

bootstrap();
