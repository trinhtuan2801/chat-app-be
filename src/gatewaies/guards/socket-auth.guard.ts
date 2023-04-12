import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SocketAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData()
    if (data?.user_id === process.env.SERVER_SOCKET_NAME) return true
    const token = data.headers.authorization.split(' ')[1]
    const user = await this.authService.getUserFromToken(token)
    if (user) {
      data.user_id = user.id
      data.user_name = user.name
      return true;
    }
    return false
  }
}
