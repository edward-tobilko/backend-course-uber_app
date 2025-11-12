import { Resources } from '../../../core/types/resources-enum';
import { VehicleFeatureEnum } from '../../domain/driver.domain';

export type DriverDataTypeOutput = {
  type: Resources.Drivers;
  id: string;
  attributes: {
    name: string;
    phoneNumber: string;
    email: string;
    vehicle: {
      make: string; // e.g., Toyota
      model: string; // e.g., Camry
      year: number;
      licensePlate: string;
      description: string | null;
      features: VehicleFeatureEnum[];
    };
    createdAt: Date;
  };
};

// ? DriverDataTypeOutput — это структура документа в базе («backend-level» модель, которая хранится, например, в MongoDB).
