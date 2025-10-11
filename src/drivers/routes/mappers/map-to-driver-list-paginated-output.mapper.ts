import { WithId } from 'mongodb';

import {
  DriverDataTypeAttributes,
  DriverDataTypeOutput,
} from '../output/driver-data-type.output';
import { ResourceType } from '../../../core/types/resource';
import { DriverListPaginatedTypeOutput } from '../output/driver-list-paginated-type.output';

export function mapToDriverListPaginatedOutput(
  driversAttributeData: WithId<DriverDataTypeAttributes>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): DriverListPaginatedTypeOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: driversAttributeData.map(
      (driver): DriverDataTypeOutput => ({
        type: ResourceType.Drivers,
        id: driver._id.toString(),
        attributes: {
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          email: driver.email,
          vehicle: driver.vehicle,
          createdAt: driver.createdAt,
        },
      }),
    ),
  };
}

// ? meta - Містить інформацію про поточну сторінку, розмір сторінки, загальну кількість елементів і кількість сторінок.
// ? data - Містить самі дані (список водіїв).
