import { Collection, Db, MongoClient } from 'mongodb';

import { SETTINGS_MONGO_DB } from '../core/settings-mongoDB/settings-mongo.db';
import { RideTypeAttributes } from '../rides/routes/output/ride-data-type.output';
import { DriverTypeAttributes } from '../drivers/application/output/driver-data-type.output';

let client: MongoClient;

const DRIVER_COLLECTION_NAME = 'drivers';
const RIDE_COLLECTION_NAME = 'rides';

export let driverCollection: Collection<DriverTypeAttributes>;
export let rideCollection: Collection<RideTypeAttributes>;

// * Подключения к бд
export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);

  try {
    await client.connect();

    const dataBase: Db = client.db(SETTINGS_MONGO_DB.DB_NAME);

    // * Инициализация коллекций
    driverCollection = dataBase.collection<DriverTypeAttributes>(
      DRIVER_COLLECTION_NAME,
    );
    rideCollection =
      dataBase.collection<RideTypeAttributes>(RIDE_COLLECTION_NAME);

    await dataBase.command({ ping: 1 });

    console.log(`✅ Connected to the database: ${SETTINGS_MONGO_DB.DB_NAME}`);
  } catch (error) {
    await client.close();

    throw new Error(`❌ Database not connected: ${error}`);
  }
}

// * для тестов
export async function stopDB() {
  if (!client) {
    throw new Error(`❌ No active client`);
  }

  await client.close();
}
