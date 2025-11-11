import { ApplicationError } from '../errors/application.error';
import { ApplicationResultBody } from './types/application-result-body-type';
import { ApplicationResultStatusEnum } from './types/application-result-status-enum';

export class ApplicationResult<D> {
  status: ApplicationResultStatusEnum;
  data: D | null;
  errors?: ApplicationError[];

  constructor(args: ApplicationResultBody<D>) {
    if (args.errors && args.errors.length) {
      this.status = ApplicationResultStatusEnum.Error;
      this.data = null;
      this.errors = args.errors;
    }

    this.status = ApplicationResultStatusEnum.Success;
    this.data = args.data;
  }

  hasError() {
    return this.status === ApplicationResultStatusEnum.Error;
  }
}
