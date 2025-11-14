import { CreateRideDtoCommand } from '../../../rides/application/commands/ride-dto-type.commands';
import { Currency } from '../../../rides/domain/ride.domain';

export function getRideDtoUtil(driverId: string): CreateRideDtoCommand {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
}
