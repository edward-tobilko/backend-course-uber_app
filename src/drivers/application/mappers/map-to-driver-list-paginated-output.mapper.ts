import { WithId } from 'mongodb';

import { DriverDataOutput } from '../output/driver-data-type.output';
import { DriverListPaginatedOutput } from '../output/driver-list-paginated-type.output';
import { Driver } from '../../domain/driver.domain';
import { Resources } from '../../../core/types/resources-enum';

export function mapToDriverListPaginatedOutput(
  driversAttributes: WithId<Driver>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): DriverListPaginatedOutput {
  return {
    meta: {
      page: Number(meta.pageNumber),
      pageSize: Number(meta.pageSize),
      pageCount: Math.ceil(meta.totalCount / Number(meta.pageSize)),
      totalCount: meta.totalCount,
    },
    data: driversAttributes.map(
      (driver): DriverDataOutput => ({
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

// ? meta - Содержит информацию о текущей странице: размере страницы, общем количестве элементов и количестве страниц.
// ? data - Содержит сами данные: список водителей.
