import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from 'src/users/user.service';
import { FileService } from '../file.service';

@Injectable()
export class FileGuard implements CanActivate {
  constructor(
    private readonly fileService: FileService,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    const req = context.switchToHttp().getRequest()
    const id = Number(req.params.id)
    const file = await this.fileService.findById(id)
    const { user } = req
    if (!user || user.id !== file.author_id) {
      throw new UnauthorizedException()
    }
    return true;
  }
}
