import { HttpStatus, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationErrorException extends HttpException {
  constructor(errors: ValidationError[], error = 'Validation error') {
    const errorsArr = [].concat(...errors.map((el) => Object.values(el.constraints)));
    super(
      HttpException.createBody(
        {
          message: errorsArr && errorsArr.length > 0 ? errorsArr.join(', ') : error,
          error,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        error,
        HttpStatus.BAD_REQUEST,
      ),
      HttpStatus.BAD_REQUEST,
    );
  }
}
