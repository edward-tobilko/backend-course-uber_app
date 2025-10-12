import { ResourceEnum } from '../../../core/types/resource-enum';

export enum CurrencyEnum {
  USD = 'usd',
  EUR = 'eur',
}

export type RideTypeAttributes = {
  clientName: string;
  driver: {
    id: string;
    name: string;
  };
  vehicle: {
    licensePlate: string;
    name: string;
  };
  price: number;
  currency: CurrencyEnum;
  createdAt: Date;
  updatedAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  addresses: {
    from: string;
    to: string;
  };
};

export type RideDataTypeOutput = {
  type: ResourceEnum.Rides;
  id: string;
  attributes: {
    clientName: string;
    driver: {
      id: string;
      name: string;
    };
    vehicle: {
      licensePlate: string;
      name: string;
    };
    price: number;
    currency: CurrencyEnum;
    startedAt: Date | null;
    finishedAt: Date | null;
    addresses: {
      from: string;
      to: string;
    };
  };
};

// ? RideDataTypeOutput - response to client (те що ми відправляємо клієнту).
