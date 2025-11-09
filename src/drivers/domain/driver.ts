import { ObjectId, WithId } from 'mongodb';

import { ClassFieldsOnly } from '../../core/types/fields-only-type';
import { DriverDomainDtoAttributes } from './driver-domain-dto-attributes';

export enum VehicleFeatureEnum {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
  Water = 'water',
}

export class Driver {
  _id?: ObjectId;
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
  updateAt: Date;

  private constructor(dto: ClassFieldsOnly<Driver>) {
    this.name = dto.name;
    this.phoneNumber = dto.phoneNumber;
    this.email = dto.email;
    this.vehicle = dto.vehicle;
    this.createdAt = dto.createdAt;
    this.updateAt = dto.updateAt;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static createDriver(dto: DriverDomainDtoAttributes) {
    const newDriver = new Driver({
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      vehicle: {
        make: dto.vehicleMake,
        model: dto.vehicleModel,
        year: dto.vehicleYear,
        licensePlate: dto.vehicleLicensePlate,
        description: dto.vehicleDescription,
        features: dto.vehicleFeatures,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newDriver;
  }

  updateDriver(dto: DriverDomainDtoAttributes) {
    this.name = dto.name;
    this.phoneNumber = dto.phoneNumber;
    this.email = dto.email;
    this.vehicle = {
      make: dto.vehicleMake,
      model: dto.vehicleModel,
      year: dto.vehicleYear,
      licensePlate: dto.vehicleLicensePlate,
      description: dto.vehicleDescription,
      features: dto.vehicleFeatures,
    };
    this.updatedAt = new Date();
  }

  static reconstitute(dto: ClassFieldsOnly<Driver>): WithId<Driver> {
    const instance = new Driver(dto);

    return instance as WithId<Driver>;
  }
}

// ? class Driver - доменна сутність ( Domain Entity ).
