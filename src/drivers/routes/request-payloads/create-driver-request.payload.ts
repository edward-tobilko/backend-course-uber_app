import { Resources } from '../../../core/types/resources-enum';
import { DriverDomainDtoAttributes } from '../../domain/driver-dto.domain';

export type CreateDriverRequestPayload = {
  data: {
    type: Resources.Drivers;
    attributes: DriverDomainDtoAttributes;
  };
};
