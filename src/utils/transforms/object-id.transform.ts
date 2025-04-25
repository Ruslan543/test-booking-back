import { Types } from "mongoose";

interface IOptions {
  isArray?: boolean;
}

export function transformToObjectId(options?: IOptions) {
  const { isArray = false } = options || {};

  return ({ value }: { value: unknown | unknown[] }) => {
    if (!isArray) return transform(value);

    if (!Array.isArray(value)) return value;

    const result = value.map(transform);
    return result;
  };
}

function transform(value: unknown): unknown {
  const valueString = String(value);
  if (!Types.ObjectId.isValid(valueString)) return value;

  return new Types.ObjectId(valueString);
}
