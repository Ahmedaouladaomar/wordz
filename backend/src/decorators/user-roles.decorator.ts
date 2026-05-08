import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../constants/role-type';

export const ROLES_KEY = 'roles';
// The '...roles' spread operator ensures multiple strings become one array
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
