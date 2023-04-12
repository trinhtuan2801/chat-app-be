import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Request,
  Patch,
  Req
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserGuard } from './guards/user.guard';
import { ConversationService } from 'src/conversations/conversation.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // @Get('/')
  // async getall() {
  //   try {
  //     const users = await this.userService.findAll();
  //     if (!users) {
  //       throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //     }
  //     return users;
  //   } catch {
  //     throw new HttpException('Error', HttpStatus.NOT_FOUND);
  //   }
  // }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async getUserData(@Request() req) {
    const data = req.user
    const user = await this.userService.findById(data.id)
    return user
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Post('/')
  // @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(UserGuard)
  @Patch('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.userService.update(user, createUserDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
