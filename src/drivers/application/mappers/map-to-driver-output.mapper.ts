import { WithId } from 'mongodb';

import { DriverTypeOutput } from '../output/driver-type.output';
import { ResourceEnum } from '../../../core/types/resource-enum';
import { Driver } from '../../domain/driver';

export const mapToDriverOutput = (driver: WithId<Driver>): DriverTypeOutput => {
  return {
    data: {
      type: ResourceEnum.Drivers,
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
