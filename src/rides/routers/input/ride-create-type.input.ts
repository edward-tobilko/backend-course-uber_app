import { ResourceEnum } from '../../../core/types/resource-enum';
import { RideTypeAttributes } from '../output/ride-data-type.output';

export type RideCreateTypeInput = {
  data: {
    type: ResourceEnum.Rides;
    attributes: RideTypeAttributes;
  };
};
