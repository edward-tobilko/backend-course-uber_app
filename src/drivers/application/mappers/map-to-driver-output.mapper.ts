import { WithId } from 'mongodb';

import { DriverOutput } from '../output/driver-type.output';
import { Driver } from '../../domain/driver.domain';
import { Resources } from '../../../core/types/resources-enum';

export const mapToDriverOutput = (driver: WithId<Driver>): DriverOutput => {
  return {
    data: {
      type: Resources.Drivers,
      id: driver._id.toString(),
      attributes: {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        vehicle: driver.vehicle,
        createdAt: driver.createdAt,
      },
    },
  };
};

// ? MongoDB создает поле _id (типа ObjectId), которое фронтенду лучше видеть как id: string.

// ? Эта функция:
// ? - конвертирует _id → id (в формате string),
// ? - фильтрует или реорганизует данные под нужный фронтенд-формат,
// ? - скрывает лишние внутренние поля (как __v, _id, passwordHash и т.п.).

// ? Это best practice: всегда делать mapper (DTO/ViewModel) между базовыми моделями и теми, которые возвращаются клиенту.
