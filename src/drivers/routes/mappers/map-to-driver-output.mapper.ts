import { WithId } from 'mongodb';

import { DriverTypeOutput } from '../output/driver-type.output';
import { ResourceType } from '../../../core/types/resource';
import { DriverDataTypeAttributes } from '../output/driver-data-type.output';

export const mapToDriverOutput = (
  driver: WithId<DriverDataTypeAttributes>,
): DriverTypeOutput => {
  return {
    data: {
      type: ResourceType.Drivers,
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

// ? MongoDB створює поле _id (типу ObjectId), яке фронтенду краще бачити як id: string.

// ? Ця функція:
// ? - конвертує _id → id (у форматі string),
// ? - фільтрує або реорганізовує дані під потрібний фронтенд формат,
// ? - приховує зайві внутрішні поля (як __v, _id, passwordHash і т.п.).

// ? Це best practice: завжди робити mapper (DTO/ViewModel) між базовими моделями і тими, що повертаються клієнту.
