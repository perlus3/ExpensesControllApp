import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

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

  canActivate(context: ExecutionContext) {
    const isPublicRequest = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublicRequest) {
      return true;
    }

    return super.canActivate(context);
  }

  // private isPublicRequest(context: ExecutionContext): boolean {
  //   return this.reflector.getAllAndOverride<boolean>(
  //     IS_PUBLIC_KEY,
  //     this.getTargets(context),
  //   );
  // }

  // private getTargets(context: ExecutionContext) {
  //   return [context.getHandler(), context.getClass()];
  // }
}
