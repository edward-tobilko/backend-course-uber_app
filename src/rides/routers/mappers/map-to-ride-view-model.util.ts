import { WithId } from 'mongodb';

import { RideType } from '../../types/ride.types';
import { RideViewModelType } from '../../types/ride-view-model.types';

export function mapToRideViewModelUtil(
  ride: WithId<RideType>,
): RideViewModelType {
  return {
    id: ride._id.toString(),
    clientName: ride.clientName,
    driver: ride.driver,
    vehicle: ride.vehicle,
    price: ride.price,
    currency: ride.currency,
    startedAt: ride.startedAt,
    finishedAt: ride.finishedAt,
    addresses: ride.addresses,
  };
}

// ? Навіщо це потрібно:
// * MongoDB створює поле _id (типу ObjectId), яке фронтенду краще бачити як id: string.

// * Ця функція:
// * - конвертує _id → id (у форматі string),
// * - фільтрує або реорганізовує дані під потрібний фронтенд формат,
// * - приховує зайві внутрішні поля (як __v, _id, passwordHash і т.п.).

// * Це best practice: завжди робити mapper (DTO/ViewModel) між базовими моделями і тими, що повертаються клієнту.
