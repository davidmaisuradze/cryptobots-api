import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import safeCompare from 'safe-compare';

@ValidatorConstraint({ name: 'IsPasswordNotEqual', async: true })
export class IsPasswordNotEqualConstraint implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = validationArguments.object[relatedPropertyName];

    return !safeCompare(value, relatedValue);
  }
  defaultMessage() {
    return 'The suggested password has been used in the past year. Please select a different password.';
  }
}

export function IsPasswordNotEqual(property: string, validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsPasswordNotEqualConstraint,
    });
  };
}
