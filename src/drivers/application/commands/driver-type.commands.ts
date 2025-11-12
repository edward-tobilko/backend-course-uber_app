import { DriverDomainDtoAttributes } from '../../domain/driver-dto.domain';

export type CreateDriverCommand = DriverDomainDtoAttributes;
export type UpdateDriverCommand = DriverDomainDtoAttributes & { id: string };
