import { ObjectId, WithId } from 'mongodb';

import { FieldsOnly } from '../../core/types/fields-only-type';
import { DriverDomainDtoAttributes } from './driver-dto.domain';

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
  updatedAt: Date;

  private constructor(dto: FieldsOnly<Driver>) {
    this.name = dto.name;
    this.phoneNumber = dto.phoneNumber;
    this.email = dto.email;
    this.vehicle = dto.vehicle;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;

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

  static reconstitute(dto: FieldsOnly<Driver>): WithId<Driver> {
    const instance = new Driver(dto);

    return instance as WithId<Driver>;
  }
}

// ? class Driver -> updateDriver() - бизнес-логика уровня домена, а не просто patch-update в репозитории. ( Domain Entity ).
// ? reconstitute() - метод «восстановления» (rehydration) объекта из БД:
// ? - Используется, когда ты получаешь Driver из Mongo.
// ? - Ты получаешь plain object, а хочешь — полноценный экземпляр класса с методами.
// ? - Именно reconstitute возвращает правильный тип WithId<Driver> (то есть документ с _id).
