import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/models/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserEntity => {
    const req: Request & { user?: UserEntity } = context
      .switchToHttp()
      .getRequest();
    return req.user;
  },
);
