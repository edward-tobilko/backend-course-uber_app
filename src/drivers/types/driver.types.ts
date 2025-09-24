export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
  Water = 'water',
}

export type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string; // e.g., Toyota
  vehicleModel: string; // e.g., Camry
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
  createdAt: Date;
};

export type DriverValidationError = {
  field: string;
  message: string;
};
