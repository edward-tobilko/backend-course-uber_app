import { ObjectId, WithId } from 'mongodb';

import { FieldsOnly } from '../../core/types/fields-only-type';
import { RideDtoDomain } from './ride-dto.domain';

export enum Currency {
  USD = 'usd',
  EUR = 'eur',
}

export class Ride {
  _id?: ObjectId;
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

  private constructor(dto: FieldsOnly<Ride>) {
    this.clientName = dto.clientName;
    this.driver = dto.driver;
    this.vehicle = dto.vehicle;
    this.price = dto.price;
    this.currency = dto.currency;
    this.createdAt = dto.createdAt;
    this.updatedAt = dto.updatedAt;
    this.startedAt = dto.startedAt;
    this.finishedAt = dto.finishedAt;
    this.addresses = dto.addresses;

    if (dto._id) {
      this._id = dto._id;
    }
  }

  static createRide(dto: RideDtoDomain) {
    return new Ride({
      clientName: dto.clientName,
      driver: {
        id: dto.driverId,
        name: dto.driverName,
      },
      vehicle: {
        licensePlate: dto.vehicleLicensePlate,
        name: `${dto.vehicleMake} ${dto.vehicleModel}`,
      },
      price: dto.price,
      currency: dto.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    });
  }

  static reconstitute(dto: FieldsOnly<Ride>): Promise<WithId<Ride>> {
    const instance = new Ride(dto);

    return Promise.resolve(instance as WithId<Ride>);
  }

  finishRide() {
    this.updatedAt = new Date();
    this.finishedAt = new Date();
  }
}
