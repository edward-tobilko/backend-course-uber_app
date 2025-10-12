import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverDtoTypeAttributes } from '../../application/dto/driver-dto-type-attributes';

export type DriverCreateTypeInput = {
  data: {
    type: ResourceEnum.Drivers;
    attributes: DriverDtoTypeAttributes;
  };
};
