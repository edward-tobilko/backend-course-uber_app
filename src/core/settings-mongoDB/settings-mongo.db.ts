export const SETTINGS_MONGO_DB = {
  PORT: process.env.PORT || 5001,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://eduard_tobilko:!Miami4769@uber-app-cluster.njm4aox.mongodb.net/?retryWrites=true&w=majority&appName=uber-app-cluster',
  DB_NAME: process.env.DB_NAME || 'backend-course-uber_app',
};
