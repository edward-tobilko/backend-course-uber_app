import { setupApp } from './app';
import express from 'express';

import { env } from './config/env';

const app = express();
setupApp(app); // * навешиваем middleware and routes

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

console.log('ENTRY:', __filename);
