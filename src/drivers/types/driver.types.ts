export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
  Water = 'water',
}

export type DriverType = {
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

export type DriverValidationError = {
  message: string;
  field: string;
};

// ? Пояснення:
// * DriverType — це структура документа в базі (“backend-level” модель (як зберігається у MongoDB))
