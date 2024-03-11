import { BaseException } from './base.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationFailedException extends BaseException {
  constructor(message?: string, status?: number, errors?: any[]) {
    super(message, status, errors);
    this.status = HttpStatus.BAD_REQUEST;
  }
}
