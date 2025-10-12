import { CurrencyEnum } from '../../routers/output/ride-data-type.output';

export type RideDtoTypeAttributes = {
  clientName: string;
  price: number;
  currency: CurrencyEnum;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};

// ? dto (Data Transfer Object) - те, що присилає клієнт.
