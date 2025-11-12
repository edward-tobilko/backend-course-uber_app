import { WithId } from 'mongodb';

import { DriverDataTypeOutput } from '../output/driver-data-type.output';
import { DriverListPaginatedTypeOutput } from '../output/driver-list-paginated-type.output';
import { Driver } from '../../domain/driver.domain';
import { Resources } from '../../../core/types/resources-enum';

export function mapToDriverListPaginatedOutput(
  driversAttributes: WithId<Driver>[],
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
        type: Resources.Drivers,
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
