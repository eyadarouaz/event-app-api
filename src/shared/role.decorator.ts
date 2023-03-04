import { SetMetadata } from "@nestjs/common";
import { Role } from "./role.enum";
export const Roles = (...Roles: Role[]) => SetMetadata('roles', Roles);