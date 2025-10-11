import { ObjectId, WithId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { DriverDataTypeAttributes } from '../routes/output/driver-data-type.output';
import { DriverQueryTypeInput } from '../routes/input/driver-query-type.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { DriverDtoTypeAttributes } from '../application/dto/driver-attributes';

export const driversRepository = {
  // * Найти всех водителей
  async findAllRepo(queryDto: DriverQueryTypeInput): Promise<{
    items: WithId<DriverDataTypeAttributes>[];
    totalCount: number;
  }> {
    const filter: any = {};
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchDriverNameTerm,
      searchDriverEmailTerm,
      searchVehicleMakeTerm,
    } = queryDto;

    if (searchDriverNameTerm) {
      // * встроенные операторы mongodb $regex и $options, 'i' - для игнорирования регистра
      filter.name = { $regex: searchDriverNameTerm, $options: 'i' };
    }

    if (searchDriverEmailTerm) {
      filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
    }

    if (searchVehicleMakeTerm) {
      filter['vehicle.make'] = {
        $regex: searchVehicleMakeTerm,
        $options: 'i',
      };
    }

    const items = await driverCollection
      .find(filter)

      // * "asc" (по возрастанию), то mongo используется 1
      // * "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
      .sort({ [sortBy]: sortDirection })

      // * пропускаем определённое количество док. перед тем, как вернуть нужный набор данных: Например, страница 3, pageSize=10 → пропускает 20 документов.
      .skip((pageNumber - 1) * pageSize)

      // * limit - ограничивает количество возвращаемых документов до значения pageSize
      .limit(pageSize)
      .toArray();

    const totalCount = await driverCollection.countDocuments(filter);

    return { items, totalCount };
  },

  // * Найти водителя по ID
  async findDriverByIdRepo(
    driverId: string,
  ): Promise<WithId<DriverDataTypeAttributes> | null> {
    // * ищем водителя в бд по id
    return driverCollection.findOne({ _id: new ObjectId(driverId) }); // Если результат поиска равно null или undefined, то вернем null.
  },

  async findDriverByIdOrFailRepo(
    driverId: string,
  ): Promise<WithId<DriverDataTypeAttributes>> {
    const result = await driverCollection.findOne({
      _id: new ObjectId(driverId),
    });

    if (!result) {
      throw new RepositoryNotFoundError('Driver not exist');
    }

    return result;
  },

  // * Создать нового водителя
  async createRepo(newDriver: DriverDataTypeAttributes): Promise<string> {
    // * добавляем newDriver в БД
    const insertResult = await driverCollection.insertOne(newDriver);

    return insertResult.insertedId.toString(); // ObjectId ('66efeaadeb3dafea3c3971fb')
  },

  // * Удалить водителя
  async deleteRepo(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
  },

  // * Обновить данные водителя (отправляем весь обьект)
  async updateRepo(id: string, dto: DriverDtoTypeAttributes): Promise<void> {
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

// ? driverCollection — це посилання на MongoDB колекцію (наприклад, db.collection('drivers')).
// ? .find(filter) — це метод MongoDB, який повертає всі документи в колекції з вже відфільтрованими обʼєктами.
// ? .toArray() — перетворює курсор (MongoDB Cursor) у масив об’єктів.
// ? WithId<DriverDataTypeAttributes> — це тип з бібліотеки mongodb, який означає, що кожен об’єкт має обов’язкове поле _id (додається MongoDB автоматично).
// ? Тобто findAllRepo() метод дістає всіх водіїв із бази і повертає їх як масив документів із _id.

// ? sort - Сортує дані за заданим полем і напрямком.
// ? skip - Пропускає елементи, щоб вибрати потрібну сторінку.
// ? limit - Обмежує кількість елементів на сторінці.
