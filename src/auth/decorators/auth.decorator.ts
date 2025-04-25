import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { ROLES, TypeRoles } from "../types/role.type";
import { RolesGuard } from "../guards/roles.guard";

export const ROLE_METADATA_KEY = Symbol("ROLES");

export function Auth(...roles: TypeRoles[]) {
  if (!roles.length) roles.push(ROLES.USER);

  const decorator = UseGuards(JwtAuthGuard, RolesGuard);
  return applyDecorators(SetMetadata(ROLE_METADATA_KEY, roles), decorator);
}
