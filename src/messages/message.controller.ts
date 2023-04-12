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
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/guards/Guards';
import { IMessage } from './interfaces/message.interface';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/')
  async getall() {
    try {
      const messages = await this.messageService.findAll();
      if (!messages) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return messages;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const message = await this.messageService.findById(id);
      if (!message) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createMessageDto: CreateMessageDto) {
    try {
      await this.messageService.create(createMessageDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const message = await this.messageService.findById(id);
      if (!message) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.messageService.update(message, createMessageDto as IMessage);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.messageService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
