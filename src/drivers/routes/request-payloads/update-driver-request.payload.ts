import { ResourceEnum } from '../../../core/types/resource-enum';
import { DriverDomainDtoAttributes } from '../../domain/driver-domain-dto-attributes';

export type DriverUpdateTypeInput = {
  data: {
    type: ResourceEnum.Drivers;
    id: string;
    attributes: DriverDomainDtoAttributes;
  };
};
