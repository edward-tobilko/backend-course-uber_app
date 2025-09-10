import { setupApp } from '@/app';
import express from 'express';
import { createServer } from 'node:http';

import { env } from './config/env';

const app = express();
setupApp(app); // навешиваем middleware and routes

const server = createServer(app);

server.listen(env.PORT, env.HOST, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

console.log('ENTRY:', __filename);
