import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { isEmpty } from 'lodash';

export function emptyResultHandler<T>(data: T, response: Response<T>): Response<T, Record<string, any>> {
  if (isEmpty(data)) {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
  return response.send(data);
}
