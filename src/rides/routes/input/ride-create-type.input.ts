import { ResourceEnum } from '../../../core/types/resource-enum';
import { RideDtoTypeAttributes } from '../../application/dto/ride-dto-type.attributes';

export type RideCreateTypeInput = {
  data: {
    type: ResourceEnum.Rides;
    attributes: RideDtoTypeAttributes;
  };
};
