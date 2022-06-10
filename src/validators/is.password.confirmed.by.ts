import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPasswordConfirmed', async: true })
export class IsPasswordConfirmedByConstraint implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = validationArguments.object[relatedPropertyName];

    return value === relatedValue;
  }
  defaultMessage() {
    return 'Password is not equals to password confirmation.';
  }
}

export function IsPasswordConfirmedBy(property: string, validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsPasswordConfirmedByConstraint,
    });
  };
}
