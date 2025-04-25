import { createParamDecorator } from "@nestjs/common";
import { User as UserDocument } from "generated/prisma";

export type TypeData = keyof UserDocument;

export const User = createParamDecorator(
  (data: TypeData | undefined, context) => {
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserDocument }>();
    return data ? user[data] : user;
  },
);
