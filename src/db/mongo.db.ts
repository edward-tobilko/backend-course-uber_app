import { Collection, Db, MongoClient } from 'mongodb';

import { SETTINGS_MONGO_DB } from '../core/settings-mongoDB/settings-mongo.db';
import { DriverType } from '../drivers/types/driver.types';
import { RideType } from '../rides/types/ride.types';

const DRIVER_COLLECTION_NAME = 'drivers';
const RIDE_COLLECTION_NAME = 'rides';

let client: MongoClient;

export let driverCollection: Collection<DriverType>;
export let rideCollection: Collection<RideType>;

// * Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);

  const dataBase: Db = client.db(SETTINGS_MONGO_DB.DB_NAME);

  // * Инициализация коллекций
  driverCollection = dataBase.collection<DriverType>(DRIVER_COLLECTION_NAME);
  rideCollection = dataBase.collection<RideType>(RIDE_COLLECTION_NAME);

  try {
    await client.connect();
    await dataBase.command({ ping: 1 });

    console.log('✅ Connected to the database');
  } catch (e) {
    await client.close();

    throw new Error(`❌ Database not connected: ${e}`);
  }
}

// * для тестов
export async function stopDB() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }

  await client.close();
}
