import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest()
    const { user } = req
    const id = Number(req.params.id)
    if (user.id !== id) {
      throw new UnauthorizedException()
    }
    return true;
  }
}
