import { ObjectId, WithId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { DriverInputDto } from '../dto/driver-input-dto.type';
import { DriverType } from '../types/driver.types';

export const driversRepository = {
  // * Найти всех водителей
  async findAll(): Promise<WithId<DriverType>[]> {
    return driverCollection.find().toArray();
  },

  // * Найти водителя по ID
  async findDriverById(driverId: string): Promise<WithId<DriverType> | null> {
    // * ищем водителя в бд по id
    return driverCollection.findOne({ _id: new ObjectId(driverId) }); // Если результат поиска равно null или undefined, то вернем null.
  },

  // * Создать нового водителя
  async create(newDriver: DriverType): Promise<WithId<DriverType>> {
    // * добавляем newDriver в БД
    const insertResult = await driverCollection.insertOne(newDriver);

    return { ...newDriver, _id: insertResult.insertedId }; //ObjectId ('66efeaadeb3dafea3c3971fb')
  },

  // * Удалить водителя
  async delete(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },

  // * Обновить данные водителя (отправляем весь обьект)
  async update(id: string, dto: DriverInputDto): Promise<void> {
    const updateResult = await driverCollection.updateOne(
      { _id: new ObjectId(id) },

      // * змінюємо поля, які нам потрібні, але обʼєкт потрібно надсилати весь
      {
        $set: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          vehicle: {
            make: dto.vehicleMake,
            model: dto.vehicleModel,
            year: dto.vehicleYear,
            licensePlate: dto.vehicleLicensePlate,
            description: dto.vehicleDescription,
            features: dto.vehicleFeatures,
          },
        },
      },
    );

    // * перевіряємо, якщо водія не знайдено, то викидуємо помилку
    if (updateResult.matchedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },
};

// ? Що тут відбувається:
// * driverCollection — це посилання на MongoDB колекцію (наприклад, db.collection('drivers')).
// * .find() — це метод MongoDB, який повертає всі документи в колекції.
// * .toArray() — перетворює курсор (MongoDB Cursor) у масив об’єктів.
// * WithId<DriverType> — це тип з бібліотеки mongodb, який означає, що кожен об’єкт має обов’язкове поле _id (додається MongoDB автоматично).
// * Тобто findAll() дістає всіх водіїв із бази і повертає їх як масив документів із _id.
