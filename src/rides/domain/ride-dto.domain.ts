import { Currency } from './ride.domain';

export type RideDtoDomain = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
  driverName: string;
  vehicleLicensePlate: string;
  vehicleMake: string;
  vehicleModel: string;
};

// ? dto (Data Transfer Object) - внутренняя доменная модель, где мы явно сохраняем данные, необходимые для создания сущности Ride).
