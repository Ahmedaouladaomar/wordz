import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ApiConfigService } from '../../../shared/services/api-config.service.js';
import type { User } from '../../user/entities/user.entity.js';
import { UserService } from '../../user/user.service.js';
import { STRATEGIES } from '../constants/strategies.const.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, STRATEGIES.ACCESS_TOKEN) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.accessToken,
      ]),
      secretOrKey: configService.authConfig.privateKey,
    });
  }

  async validate(payload: { sub: string; email: string; sessionId: string }): Promise<User> {
    console.log('Validating Access Token for userId:', payload?.sub);

    const user = await this.userService.findOne(payload?.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
