import { VehicleFeature } from './driver.types';

export type DriverViewModelType = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  vehicle: {
    make: string; // e.g., Toyota
    model: string; // e.g., Camry
    year: number;
    licensePlate: string;
    description: string | null;
    features: VehicleFeature[];
  };
  createdAt: Date;
};

// ? Пояснення:
// * DriverViewModelType - це структура, яку ми відправляємо клієнту (“frontend-level” модель (що бачить клієнт у Postman чи браузері)).
