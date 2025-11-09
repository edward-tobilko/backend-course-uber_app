import { DriverDomainDtoAttributes } from '../../domain/driver-domain-dto-attributes';

export type CreateDriverCommand = DriverDomainDtoAttributes;
export type UpdateDriverCommand = DriverDomainDtoAttributes & { id: string };
