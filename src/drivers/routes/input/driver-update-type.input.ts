import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverDtoTypeAttributes } from '../../application/dto/driver-dto-type-attributes';

export type DriverUpdateTypeInput = {
  data: {
    type: ResourceEnum.Drivers;
    id: string;
    attributes: DriverDtoTypeAttributes;
  };
};
