/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../users/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user, done: Function) {
    done(null, { id: user.id, name: user.name });
  }
  async deserializeUser(user, done: Function) {
    const userDb = await this.userService.findById(user.id);
    return userDb ? done(null, userDb) : done(null, null);
  }
}
