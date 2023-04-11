import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'AuthGuard_Public';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  static GlobalProtected() {
    return {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    };
  }

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRequest = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicRequest) {
      return true;
    }

    return super.canActivate(context);
  }
}
