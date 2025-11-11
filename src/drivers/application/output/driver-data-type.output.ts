import { ResourceEnum } from '../../../core/types/resources-enum';
import { VehicleFeatureEnum } from '../../domain/driver';

export type DriverDataTypeOutput = {
  type: ResourceEnum.Drivers;
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

// ? DriverDataTypeOutput — це структура документа в базі (“backend-level” модел, яка зберігається, наприклад, у MongoDB).
