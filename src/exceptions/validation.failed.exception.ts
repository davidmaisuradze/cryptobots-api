import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class ValidationFailedException extends BaseException {
  constructor(...args: any[]) {
    super(...args);
    this.status = HttpStatus.NOT_ACCEPTABLE;
  }
}
