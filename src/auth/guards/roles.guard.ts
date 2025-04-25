import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "generated/prisma";
import { TypeRoles } from "../types/role.type";
import { ROLE_METADATA_KEY } from "../decorators/auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<TypeRoles[]>(
      ROLE_METADATA_KEY,
      context.getHandler(),
    );
    if (!roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new ForbiddenException("Пользователь не найден");
    }

    const hasRole = roles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException("Доступ запрещён");
    }

    return true;
  }
}
