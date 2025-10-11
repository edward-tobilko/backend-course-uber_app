import { WithId } from 'mongodb';

import { driversRepository } from '../repositories/drivers.repository';
import { DriverQueryTypeInput } from '../routes/input/driver-query-type.input';
import { DriverDataTypeAttributes } from '../routes/output/driver-data-type.output';

export const driversService = {
  async findAll(queryDto: DriverQueryTypeInput): Promise<{
    items: WithId<DriverDataTypeAttributes>[];
    totalCount: number;
  }> {
    return await driversRepository.findAllRepo(queryDto);
  },
};
