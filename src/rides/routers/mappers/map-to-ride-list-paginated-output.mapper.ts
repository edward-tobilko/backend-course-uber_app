import { WithId } from 'mongodb';

import {
  RideDataTypeOutput,
  RideTypeAttributes,
} from '../output/ride-data-type.output';
import { RideListPaginatedOutput } from '../output/ride-list-paginated-type.output';
import { ResourceType } from '../../../core/types/resource-enum';

export const mapToRideListPaginatedOutput = (
  rideAttributes: WithId<RideTypeAttributes>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): RideListPaginatedOutput => {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: rideAttributes.map(
      (ride): RideDataTypeOutput => ({
        type: ResourceType.Rides,
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
      }),
    ),
  };
};

// ? meta - Містить інформацію про поточну сторінку, розмір сторінки, загальну кількість елементів і кількість сторінок.
// ? data - Містить самі дані (список водіїв).
