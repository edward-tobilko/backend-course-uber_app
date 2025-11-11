import { CurrencyEnum } from '../output/ride-data-type.output';

export type CreateRideDtoCommand = {
  clientName: string;
  price: number;
  currency: CurrencyEnum;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};

// ? dto (Data Transfer Object) - то, что присылает клиент.
