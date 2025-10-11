import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../core/utils/http-statuses';
import { SETTINGS_MONGO_DB } from '../../core/settings-mongoDB/settings-mongo.db';

export const adminGuardMiddlewareAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'] as string; // 'Basic xxxx' - Получаем заголовок Authorization из запроса.

  if (!auth) {
    return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }

  try {
    const [authType, token] = auth.split(' '); // admin:qwerty - разбиваем строку по пробелу, получая тип авторизации (Basic) и сам токен.

    if (authType !== 'Basic')
      return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);

    const credentials = Buffer.from(token, 'base64').toString('utf-8'); // dbcadkcnasdk - Расшифровываем токен из base64 в обычную строку.

    const [username, password] = credentials.split(':'); // разделяем её на логин и пароль.

    if (
      username !== SETTINGS_MONGO_DB.ADMIN_USERNAME ||
      password !== SETTINGS_MONGO_DB.ADMIN_PASSWORD
    ) {
      return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
    }

    next(); // Успешная авторизация, продолжаем.
  } catch (error) {
    console.error('Auth decode error:', error);
    return res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }
};

// ? Токен — это строка, закодированная в формате base64, которая представляет собой username:password.
// ? process - это глобальный объект в Node.js, который предоставляет информацию о текущем процессе Node.js
// ? env — это объект, который хранит все переменные окружения текущего процесса. Переменные окружения — это значения, которые могут быть установлены на уровне операционной системы или приложения и которые могут использоваться для настройки поведения программного обеспечения (например, пароли, ключи API, пути к файлам и т. д.).
