import { Currency } from '../types/ride.types';

export type RideInputDtoType = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: number;
  fromAddress: string;
  toAddress: string;
};
