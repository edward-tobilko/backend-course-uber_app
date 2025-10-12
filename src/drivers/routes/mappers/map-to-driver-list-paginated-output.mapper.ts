import { WithId } from 'mongodb';

import {
  DriverDataTypeOutput,
  DriverTypeAttributes,
} from '../output/driver-data-type.output';
import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverListPaginatedTypeOutput } from '../output/driver-list-paginated-type.output';

export function mapToDriverListPaginatedOutput(
  driversAttributes: WithId<DriverTypeAttributes>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): DriverListPaginatedTypeOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: driversAttributes.map(
      (driver): DriverDataTypeOutput => ({
        type: ResourceEnum.Drivers,
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
