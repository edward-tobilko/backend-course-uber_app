import { Resources } from '../../../core/types/resources-enum';
import { CreateRideDtoCommand } from '../../application/commands/create-ride-dto-type.command';

type CreateRideAttributes = CreateRideDtoCommand;

export type CreateRideRequestPayload = {
  data: {
    type: Resources.Rides;
    attributes: CreateRideAttributes;
  };
};
