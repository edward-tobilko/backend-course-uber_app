import { Resources } from '../../../core/types/resources-enum';
import { Currency } from '../../domain/ride.domain';

export type RideDataOutput = {
  type: Resources.Rides;
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
    currency: Currency;
    startedAt: Date | null;
    finishedAt: Date | null;
    addresses: {
      from: string;
      to: string;
    };
  };
};

// ? RideDataOutput - response to client (то, что мы отправляем клиенту).
