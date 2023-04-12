import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest() as Request
    const { phone, password } = req.body
    const user = await this.authService.validateUser({ phone, password })
    if (user) {
      req.user = user
      return true;
    }
    return false
  }
}
