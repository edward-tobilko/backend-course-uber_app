import { ResourceType } from '../../../core/types/resource';
import { DriverDtoTypeAttributes } from '../../application/dto/driver-attributes';

export type DriverUpdateTypeInput = {
  data: {
    type: ResourceType.Drivers;
    id: string;
    attributes: DriverDtoTypeAttributes;
  };
};
