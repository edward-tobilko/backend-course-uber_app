import { DriverDomainDtoAttributes } from '../../domain/driver-dto.domain';

export type CreateDriverDtoCommand = DriverDomainDtoAttributes;
export type UpdateDriverDtoCommand = DriverDomainDtoAttributes & { id: string };

// ? dto (Data Transfer Object) - то, что присылает клиент.
