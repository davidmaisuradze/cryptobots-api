import { BaseException } from '../../common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends BaseException {
  constructor(message?: string, status?: number, errors?: any[]) {
    super(message, status, errors);
    this.status = HttpStatus.FORBIDDEN;
  }
}
