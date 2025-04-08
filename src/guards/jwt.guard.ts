import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JWTGuardCustom extends AuthGuard('jwt') {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<UserEntity>(
        _: any,
        user: UserEntity,
        info: any
    ): UserEntity | never {
        let message = 'Without token'
        if (info instanceof Error) {
            message = info.message
        }
        if (!user) throw new UnauthorizedException(message);
        return user;
    }
}