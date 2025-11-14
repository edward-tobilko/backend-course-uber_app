import { ObjectId } from 'mongodb';

import { driverCollection } from '../../db/mongo.db';
import { mapToDriverListPaginatedOutput } from '../application/mappers/map-to-driver-list-paginated-output.mapper';
import { DriverListPaginatedOutput } from '../application/output/driver-list-paginated-type.output';
import { DriverOutput } from '../application/output/driver-type.output';
import { DriverListRequestPayload } from '../routes/request-payloads/driver-list-request.payload';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { mapToDriverOutput } from '../application/mappers/map-to-driver-output.mapper';

export class DriverQueryRepository {
  // * Найти всех водителей
  async findAllDriversQueryRepo(
    queryDto: DriverListRequestPayload,
  ): Promise<DriverListPaginatedOutput> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchDriverNameTerm,
      searchDriverEmailTerm,
      searchVehicleMakeTerm,
    } = queryDto;

    const filter = {
      // * встроенные операторы mongodb $regex и $options, 'i' - для игнорирования регистра
      $or: [
        { name: { $regex: searchDriverNameTerm ?? '', $options: 'i' } },
        { email: { $regex: searchDriverEmailTerm ?? '', $options: 'i' } },
      ],
      ...(searchVehicleMakeTerm
        ? { 'vehicle.make': { $regex: searchVehicleMakeTerm, $options: 'i' } }
        : {}),
    };

    const items = await driverCollection
      .find(filter)

      // * "asc" (по возрастанию), то mongo используется 1
      // * "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
      .sort({ [sortBy]: sortDirection })

      // * пропускаем определённое количество док. перед тем, как вернуть нужный набор данных: Например, страница 3, pageSize=10 → пропускает 20 документов.
      .skip((pageNumber - 1) * pageSize)

      // * limit - ограничивает количество возвращаемых документов до значения pageSize
      .limit(Number(pageSize))
      .toArray();

    const totalCount = await driverCollection.countDocuments(filter);

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
      pageNumber,
      pageSize,
      totalCount,
    });

    return driversListOutput;
  }

  // * Найти водителя по ID
  async findDriverByIdOrFailQueryRepo(driverId: string): Promise<DriverOutput> {
    const driver = await driverCollection.findOne({
      _id: new ObjectId(driverId),
    });

    if (!driver) {
      throw new RepositoryNotFoundError('Driver is not exist');
    }

    return mapToDriverOutput(driver);
  }
}

// ? driverCollection — это ссылка на коллекцию MongoDB (например, db.collection(„drivers“)).
// ? .find(filter) — это метод MongoDB, который возвращает все документы в коллекции с уже отфильтрованными объектами.
// ? .toArray() — преобразует курсор (MongoDB Cursor) в массив объектов.
// ? sort — сортирует данные по заданному полю и направлению.
// ? skip — пропускает элементы, чтобы выбрать нужную страницу.
// ? limit — ограничивает количество элементов на странице.
