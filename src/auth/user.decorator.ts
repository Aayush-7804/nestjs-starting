import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from './auth.entity';
import { Request } from 'express';

interface AuthRequest extends Request {
  user: AuthUser;
}

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    if (!req.user) {
      throw new Error('User not found - Authentication required');
    }
    return req.user;
  },
);
