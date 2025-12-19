import { ApplicationError } from '../errors/application.error';
import { ApplicationResultBody } from './types/application-body.result';
import { ApplicationResultStatus } from './types/application-status.result-type';

export class ApplicationResult<D> {
  status: ApplicationResultStatus;
  data: D | null;
  errors?: ApplicationError[];

  constructor(args: ApplicationResultBody<D>) {
    if (args.errors && args.errors.length) {
      this.status = ApplicationResultStatus.Error;
      this.data = null;
      this.errors = args.errors;
    }

    this.status = ApplicationResultStatus.Success;
    this.data = args.data;
  }

  hasError() {
    return this.status === ApplicationResultStatus.Error;
  }
}
