import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class UserNotActiveException extends BaseException {
  constructor(...args) {
    super(...args);
    this.status = HttpStatus.FORBIDDEN;
  }
}
