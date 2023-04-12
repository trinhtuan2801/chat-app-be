import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  Res,
  Response,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  // @Get('login')
  // getLogin(@Response() res) {
  //   res.sendFile(process.cwd() + '/client/login.html');
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.getNewTokens(req.user)
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @Post('access-token')
  async getAccessToken(@Body() body) {
    try {
      const { refresh_token } = body
      const user = await this.authService.getUserFromToken(refresh_token)
      if (user.refresh_token === refresh_token) {
        return await this.authService.getNewTokens(user)
      } else {
        throw new UnauthorizedException()
      }
    } catch (err) {
      throw new UnauthorizedException()
    }
  }

  @Post('register')
  async registerUser(@Body() input) {
    const user = await this.userService.findByEmail(input.email);
    if (user) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.create(input);
  }
}
