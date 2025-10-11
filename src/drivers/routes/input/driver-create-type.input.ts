import { ResourceType } from '../../../core/types/resource';
import { DriverDtoTypeAttributes } from '../../application/dto/driver-attributes';

export type DriverCreateTypeInput = {
  data: {
    type: ResourceType.Drivers;
    attributes: DriverDtoTypeAttributes;
  };
};
