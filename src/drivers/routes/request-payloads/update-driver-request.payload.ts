import { Resources } from '../../../core/types/resources-enum';
import { DriverDomainDtoAttributes } from '../../domain/driver-dto.domain';

export type UpdateDriverRequestPayload = {
  data: {
    type: Resources.Drivers;
    id: string;
    attributes: DriverDomainDtoAttributes;
  };
};
