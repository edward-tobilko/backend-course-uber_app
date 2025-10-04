import { Currency } from './ride.types';

export type RideViewModelType = {
  id: string;
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

// ? Пояснення:
// * RideViewModelType - це структура, яку ми відправляємо клієнту (“frontend-level” модель (що бачить клієнт у Postman чи браузері)).
