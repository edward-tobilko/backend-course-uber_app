import { Resources } from '../../../core/types/resources-enum';
import { CreateRideDtoCommand } from '../../application/commands/ride-dto-type.commands';

type CreateRideAttributes = CreateRideDtoCommand;

export type CreateRideRequestPayload = {
  data: {
    type: Resources.Rides;
    attributes: CreateRideAttributes;
  };
};
