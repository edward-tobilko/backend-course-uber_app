import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development.local' });
}

const env = process.env.NODE_ENV ?? 'development';

const defaultDbName =
  env === 'production'
    ? 'backend-course-uber_app_prod'
    : env === 'test'
      ? 'backend-course-uber_app_test'
      : 'backend-course-uber_app_dev';

export const SETTINGS_MONGO_DB = {
  MONGO_URL: process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017',
  DB_NAME: process.env.DB_NAME ?? defaultDbName,

  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '',
};
