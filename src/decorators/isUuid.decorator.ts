import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { validate as isValidUUID } from "uuid";

@ValidatorConstraint({ async: false })
export class IsUUIDConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return isValidUUID(value);
  }

  defaultMessage() {
    return "Неверный формат ID";
  }
}

export function IsUUID(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUIDConstraint,
    });
  };
}
