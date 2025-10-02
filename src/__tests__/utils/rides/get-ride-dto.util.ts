import { RideInputDtoType } from '../../../rides/dto/ride-input-dto.types';
import { Currency } from '../../../rides/types/ride.types';

export function getRideDtoUtil(driverId: number): RideInputDtoType {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
}
