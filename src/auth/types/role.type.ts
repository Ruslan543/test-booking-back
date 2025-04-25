export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type TypeRoles = (typeof ROLES)[keyof typeof ROLES];
