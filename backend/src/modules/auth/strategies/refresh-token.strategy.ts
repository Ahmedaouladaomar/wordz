import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenType } from '@/constants/token-type';
import { ApiConfigService } from '@/shared/services/api-config.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, TokenType.REFRESH_TOKEN) {
  constructor(configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.refreshToken,
      ]),
      secretOrKey: configService.authConfig.refreshKey,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: { sub: string; sessionId: string }) {
    const refreshToken: string = req.cookies?.refreshToken as string;
    return {
      userId: payload.sub,
      sessionId: payload.sessionId,
      refreshToken,
    };
  }
}
