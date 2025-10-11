import { ResourceType } from '../../../core/types/resource';

export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
  Water = 'water',
}

export type DriverDataTypeAttributes = {
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

export type DriverDataTypeOutput = {
  type: ResourceType.Drivers;
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
      features: VehicleFeature[];
    };
    createdAt: Date;
  };
};

// ? DriverDataTypeOutput — це структура документа в базі (“backend-level” модель який зберігається, наприклад, у MongoDB).
