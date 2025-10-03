import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { RideType } from '../../types/ride.types';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { dataBase } from '../../../db/mongo.db';
import { RideInputDtoType } from '../../dto/ride-input-dto.types';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';

export function createRideHandler(
  req: Request<{}, {}, RideInputDtoType>,
  res: Response,
) {
  const driver = driversRepository.findDriverById(req.body.driverId);

  if (!driver) {
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
      .json(
        createErrorMessages([{ field: 'id', message: 'Driver is not found' }]),
      );
  }

  const newRide: RideType = {
    id: dataBase.rides.length
      ? dataBase.rides[dataBase.rides.length - 1].id + 1
      : 1,
    clientName: req.body.clientName,
    driverId: req.body.driverId,
    driverName: driver.name,
    vehicleLicensePlate: driver.vehicleLicensePlate,
    vehicleName: `${driver.vehicleMake} - ${driver.vehicleModel}`,
    price: req.body.price,
    currency: req.body.currency,
    createdAt: new Date(),
    updatedAt: null,
    addresses: {
      from: req.body.fromAddress,
      to: req.body.toAddress,
    },
  };

  ridesRepository.createNewRide(newRide);

  res.status(HTTP_STATUS_CODES.CREATED_201).json(newRide);
}
