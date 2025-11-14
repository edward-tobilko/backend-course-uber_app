import { WithId } from 'mongodb';

import { Resources } from '../../../core/types/resources-enum';
import { RideListPaginatedOutput } from '../output/ride-list-paginated-type.output';
import { Ride } from '../../domain/ride.domain';

export const mapToRideListPaginatedOutput = (
  rideAttributes: WithId<Ride>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): RideListPaginatedOutput => {
  return {
    meta: {
      page: Number(meta.pageNumber),
      pageSize: Number(meta.pageSize),
      pageCount: Math.ceil(meta.totalCount / Number(meta.pageSize)),
      totalCount: meta.totalCount,
    },
    data: rideAttributes.map((ride) => ({
      type: Resources.Rides,
      id: ride._id.toString(),
      attributes: {
        clientName: ride.clientName,
        driver: ride.driver,
        vehicle: ride.vehicle,
        price: ride.price,
        currency: ride.currency,
        startedAt: ride.startedAt,
        finishedAt: ride.finishedAt,
        addresses: ride.addresses,
      },
    })),
  };
};

// ? meta - Содержит информацию о текущей странице, размере страницы, общем количестве элементов и количестве страниц.
// ? data - Содержит данные (список водителей).
