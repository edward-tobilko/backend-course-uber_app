import { WithId } from 'mongodb';

import { Ride } from '../../domain/ride.domain';
import { Resources } from '../../../core/types/resources-enum';
import { RideOutput } from '../output/ride-type.output';

export function mapToRideOutput(ride: WithId<Ride>): RideOutput {
  return {
    data: {
      type: Resources.Rides,
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

// ? MongoDB создает поле _id (типа ObjectId), которое фронтенду лучше видеть как id: string.

// ? Эта функция:
// ? - конвертирует _id → id (в формате string),
// ? - фильтрует или реорганизует данные под нужный фронтенд-формат,
// ? - скрывает лишние внутренние поля (как __v, _id, passwordHash и т.п.).

// ? Это best practice: всегда делать mapper (DTO/ViewModel) между базовыми моделями и теми, которые возвращаются клиенту.
