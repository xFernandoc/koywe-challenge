import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/models/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) : UserEntity => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);