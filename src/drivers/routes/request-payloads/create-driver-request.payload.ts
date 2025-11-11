import { ResourceEnum } from '../../../core/types/resources-enum';
import { DriverDomainDtoAttributes } from '../../domain/driver-domain-dto-attributes';

export type CreateDriverRequestPayload = {
  data: {
    type: ResourceEnum.Drivers;
    attributes: DriverDomainDtoAttributes;
  };
};
