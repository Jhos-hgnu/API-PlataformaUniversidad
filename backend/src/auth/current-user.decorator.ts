import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { create } from 'node:domain';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
