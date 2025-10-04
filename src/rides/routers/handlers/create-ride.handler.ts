import { Request, Response } from 'express';

import { ridesRepository } from '../../repositories/rides.repository';
import { RideType } from '../../types/ride.types';
import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { RideInputDtoType } from '../../dto/ride-input-dto.types';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { createErrorMessages } from '../../../core/utils/error-messages.utils';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export async function createRideHandler(
  req: Request<{}, {}, RideInputDtoType>,
  res: Response,
) {
  try {
    const driver = await driversRepository.findDriverById(req.body.driverId);

    if (!driver) {
      return res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .json(
          createErrorMessages([
            { field: 'id', message: 'Driver is not found' },
          ]),
        );
    }

    // * Если у водителя сейчас есть заказ, то создать новую поездку нельзя
    const activeRide = await ridesRepository.findActiveRideByDriverId(
      req.body.driverId,
    );

    if (activeRide) {
      res
        .status(HTTP_STATUS_CODES.BAD_REQUEST_400)
        .send(
          createErrorMessages([
            { field: 'status', message: 'The driver is currently on a job' },
          ]),
        );
      return;
    }

    const newRide: RideType = {
      clientName: req.body.clientName,
      driver: {
        id: req.body.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} - ${driver.vehicle.model}`,
      },
      price: req.body.price,
      currency: req.body.currency,
      createdAt: new Date(),
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: req.body.fromAddress,
        to: req.body.toAddress,
      },
    };

    const createRide = await ridesRepository.createNewRide(newRide);

    const rideViewModelResponse = mapToRideViewModelUtil(createRide);

    res.status(HTTP_STATUS_CODES.CREATED_201).json(rideViewModelResponse);
  } catch (error: unknown) {
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
  }
}
