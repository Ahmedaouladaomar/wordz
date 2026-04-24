import { STRATEGIES } from '@/modules/auth/constants/strategies.const';
import type { IAuthGuard, Type } from '@nestjs/passport';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

export function AuthGuard(
  options?: Partial<{ public: boolean; refreshToken: boolean }>,
): Type<IAuthGuard> {
  // If it's explicitly public, we usually don't want a Guard.
  // But if you have a 'public' strategy that handles guest users:
  if (options?.public) {
    return NestAuthGuard(STRATEGIES.PUBLIC);
  }

  // If we are on a refresh route, we ONLY want the refresh strategy
  if (options?.refreshToken) {
    return NestAuthGuard(STRATEGIES.REFRESH_TOKEN);
  }

  // Default to the standard Access Token
  return NestAuthGuard(STRATEGIES.ACCESS_TOKEN);
}
