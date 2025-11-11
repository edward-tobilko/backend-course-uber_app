export enum Currency {
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
  currency: Currency;
  createdAt: Date;
  updatedAt: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  addresses: {
    from: string;
    to: string;
  };
};
