// import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';
// import { Observable } from 'rxjs';
//
// export const REFRESH_SESSION_TOKEN = 'RefreshSessionToken';
//
// export const Refresh = () => SetMetadata(REFRESH_SESSION_TOKEN, true);
//
// @Injectable()
// export default class JwtRefreshTokenGuard extends AuthGuard(
//   'jwt-refresh-token',
// ) {
//   constructor(private reflector: Reflector) {
//     super();
//   }
//
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const isRequestWithRefreshToken = this.reflector.getAllAndOverride<boolean>(
//       REFRESH_SESSION_TOKEN,
//       [context.getHandler(), context.getClass()],
//     );
//     if (isRequestWithRefreshToken) {
//       return true;
//     }
//
//     return super.canActivate(context);
//   }
// }
