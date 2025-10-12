import { RideDtoTypeAttributes } from '../../../rides/application/dto/ride-dto-type.attributes';
import { CurrencyEnum } from '../../../rides/routers/output/ride-data-type.output';

export function getRideDtoUtil(driverId: string): RideDtoTypeAttributes {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: CurrencyEnum.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
}
