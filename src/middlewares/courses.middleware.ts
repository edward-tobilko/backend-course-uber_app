import express from "express";

import { createApp } from "../app";

const app = createApp();

// ? MIDDLEWARE - створюємо проміжуточний шар для body, для метода post
const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);
