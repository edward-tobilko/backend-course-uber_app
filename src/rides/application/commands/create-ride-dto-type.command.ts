import { Currency } from '../../domain/ride.domain';

export type CreateRideDtoCommand = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};

// ? dto (Data Transfer Object) - то, что присылает клиент.
