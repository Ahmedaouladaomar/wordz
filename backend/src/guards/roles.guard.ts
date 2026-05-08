import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { RoleType } from '../constants/role-type';
import { AuthUserDto } from '@/modules/auth/dto/auth-user.dto';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[] | undefined>(ROLES_KEY, context.getHandler());

    // Does not require any role
    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: AuthUserDto }>();
    const user = request.user;

    return roles.includes(user.role);
  }
}
