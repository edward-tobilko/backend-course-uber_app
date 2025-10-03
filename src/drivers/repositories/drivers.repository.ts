import { ObjectId, WithId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { DriverInputDto } from '../dto/driver-input-dto.type';
import { DriverType } from '../types/driver.types';

export const driversRepository = {
  // * Найти всех водителей
  async findAll(): Promise<WithId<DriverType[]>> {
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

    return { ...newDriver, _id: insertResult.insertedId };
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
  async updatePut(id: string, dto: DriverInputDto): Promise<void> {
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
    if ((await updateResult).matchedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },

  // * Обновить данные водителя (отправляем только то поле обьекта, которую изменили)
  async updatePatch(
    id: string,
    dto: Partial<Pick<DriverInputDto, 'name'>>,
  ): Promise<DriverType> {
    const updateResult = await driverCollection.updateOne(
      { _id: new ObjectId(id) },

      // * змінюємо поля, які нам потрібні, але обʼєкт потрібно надсилати весь
      {
        $set: {
          name: dto.name,
        },
      },
    );

    // * перевіряємо, якщо водія не знайдено, то викидуємо помилку
    if (updateResult.matchedCount < 1) {
      throw new Error('Driver not exist');
    }

    if (typeof dto.name === 'string') {
      updateResult = dto.name;
    }

    return updateResult;
  },
};

// ? Пояснення для updatePatch:
// * Pick - бере тільки вибрані поля з типу. Тут ми кажемо: «візьми тільки поле name з DriverInputDto.
// * Partial<...> - Partial робить усі поля необов’язковими (додає ?).
