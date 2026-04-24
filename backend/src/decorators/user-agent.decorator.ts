import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: any = ctx.switchToHttp().getRequest();
  return request.headers['user-agent'] || 'Unknown Device';
});
