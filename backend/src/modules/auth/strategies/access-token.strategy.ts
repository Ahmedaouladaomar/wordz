import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from '../../../shared/services/api-config.service.js';
import { UserService } from '../../user/user.service.js';
import { STRATEGIES } from '../constants/strategies.const.js';
import { AuthUserDto } from '../dto/auth-user.dto.js';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, STRATEGIES.ACCESS_TOKEN) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.privateKey,
    });
  }

  async validate(payload: { sub: string; email: string; sessionId: string }) {
    // Payload Validation
    if (!payload.sub || !payload.sessionId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userService.findOne(payload.sub);

    // User Validation
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return the user + Session info
    // This object becomes "req.user"
    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sessionId: payload.sessionId,
      city: user.city,
      dailyTarget: user.dailyTarget,
    } as AuthUserDto;
  }
}
