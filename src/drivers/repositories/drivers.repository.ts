import { ObjectId, WithId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { Driver } from '../domain/driver.domain';

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
