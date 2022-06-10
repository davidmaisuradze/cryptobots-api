import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@ValidatorConstraint({ name: 'IsUserAlreadyExists', async: true })
@Injectable()
export class IsUserAlreadyExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(email: string) {
    const user = await this.userService.findOneByEmail(email);
    return !user;
  }
  defaultMessage() {
    return 'User with this email already exists.';
  }
}

export function IsUserAlreadyExists(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistsConstraint,
    });
  };
}
