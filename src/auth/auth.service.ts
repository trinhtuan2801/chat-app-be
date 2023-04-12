import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { compareHash } from '../utils/helpers';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(userDetails) {
    // const user = await this.userService.findByUsername(userDetails.username);
    const user = await this.userService.findByPhone(userDetails.phone)
    console.log(user)
    if (!user)
      throw new UnauthorizedException()
    const isMatchedPassword = await compareHash(
      userDetails.password,
      user.password,
    );
    if (!isMatchedPassword) {
      throw new UnauthorizedException()
    }
    return user
  }

  async getNewTokens(user: any) {
    const { id, phone } = user
    const access_token = await this.jwtService.signAsync({
      user: { id, phone }
    }, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME
    })
    const refresh_token = await this.jwtService.signAsync({
      user: { id, phone }
    }, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME
    })
    await this.userService.update(user, {
      refresh_token
    })
    return {
      access_token,
      refresh_token,
      expireIn: process.env.JWT_ACCESS_EXPIRE_TIME
    }
  }

  async getUserFromToken(token) {
    const data = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY })
    const { user: { phone } } = data
    const user = await this.userService.findByPhone(phone)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}
