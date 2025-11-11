import { ObjectId, WithId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { Driver } from '../domain/driver';

export class DriversRepository {
  // * Найти водителя по ID
  async findDriverByIdOrFailRepo(driverId: string): Promise<WithId<Driver>> {
    const driver = await driverCollection.findOne({
      _id: new ObjectId(driverId),
    });

    if (!driver) {
      throw new RepositoryNotFoundError('Driver is not exist');
    }

    return Driver.reconstitute(driver);
  }

  // * Создаем и добавляем нового водителя в БД
  async saveRepo(newDriver: Driver): Promise<Driver> {
    if (!newDriver._id) {
      const insertResult = await driverCollection.insertOne(newDriver);

      newDriver._id = insertResult.insertedId;

      return newDriver;
    } else {
      // * Обновить данные водителя (отправляем весь обьект)
      const { _id, ...dtoToUpdate } = newDriver;

      const updateResult = await driverCollection.updateOne(
        { _id },
        {
          $set: {
            ...dtoToUpdate,
          },
        },
      );

      // * проверяем, если водитель не найден, то выбрасываем ошибку
      if (updateResult.matchedCount < 1) {
        throw new RepositoryNotFoundError('Driver is not exist');
      }

      return newDriver;
    }
  }

  // * Удалить водителя
  async deleteRepo(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Driver not exist');
    }

    return;
  }
}

// ? driverCollection — это ссылка на коллекцию MongoDB (например, db.collection(„drivers“)).
// ? .find(filter) — это метод MongoDB, который возвращает все документы в коллекции с уже отфильтрованными объектами.
// ? .toArray() — преобразует курсор (MongoDB Cursor) в массив объектов.
// ? WithId<DriverDataTypeAttributes> — это тип из библиотеки mongodb, который означает, что каждый объект имеет обязательное поле _id (добавляется MongoDB автоматически).
// ? Тоесть findAllRepo() метод получает всех водителей из базы и возвращает их как массив документов с _id.
// ? sort — сортирует данные по заданному полю и направлению.
// ? skip — пропускает элементы, чтобы выбрать нужную страницу.
// ? limit — ограничивает количество элементов на странице.
