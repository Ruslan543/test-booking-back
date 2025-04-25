import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { validate as isValidUUID } from "uuid";

export class IdValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== "param") return value;

    if (!isValidUUID(value)) {
      throw new BadRequestException("Неверный формат ID");
    }

    return value;
  }
}
