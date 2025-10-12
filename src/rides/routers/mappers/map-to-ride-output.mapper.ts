import { WithId } from 'mongodb';

import { RideTypeAttributes } from '../output/ride-data-type.output';
import { ResourceType } from '../../../core/types/resource-enum';
import { RideTypeOutput } from '../output/ride-type.output';

export function mapToRideOutputMapper(
  ride: WithId<RideTypeAttributes>,
): RideTypeOutput {
  return {
    data: {
      type: ResourceType.Rides,
      id: ride._id.toString(),
      attributes: {
        clientName: ride.clientName,
        driver: ride.driver,
        vehicle: ride.vehicle,
        price: ride.price,
        currency: ride.currency,
        startedAt: ride.startedAt,
        finishedAt: ride.finishedAt,
        addresses: ride.addresses,
      },
    },
  };
}

// ? MongoDB створює поле _id (типу ObjectId), яке фронтенду краще бачити як id: string.

// ? Ця функція:
// ? - конвертує _id → id (у форматі string),
// ? - фільтрує або реорганізовує дані під потрібний фронтенд формат,
// ? - приховує зайві внутрішні поля (як __v, _id, passwordHash і т.п.).

// ? Це best practice: завжди робити mapper (DTO/ViewModel) між базовими моделями і тими, що повертаються клієнту.
