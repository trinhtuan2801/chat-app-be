import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/repos/user.repository';
import { UserService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './guards/jwt.strategy';
import { LocalStrategy } from './strategies/LocalStrategy';
import { SessionSerializer } from './strategies/SessionSerializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    AuthService,
    UserService,
  ],
  exports: [AuthService, AuthModule]
})
export class AuthModule { }
