import {
  Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpException,
  HttpStatus, Param, ParseIntPipe, Post, Query, Req, Res, Response, UseGuards, UseInterceptors
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatGateWay } from 'src/gatewaies/chat.gateway';
import { ConversationService } from '../conversations/conversation.service';
import { UserService } from '../users/user.service';
import { AddMultipleUsersDto } from './dto/addMultipleUser.dto';
import { CreateUserConversationDto } from './dto/create-userConversation.dto';
import { UserConversationService } from './userConversation.service';

@UseGuards(JwtGuard)
@Controller('user-conversation')
export class UserConversationController {
  constructor(
    private readonly userConversationService: UserConversationService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
    private readonly chatGateWay: ChatGateWay
  ) { }

  // async getall() {
  //   try {
  //     const userConversations = await this.userConversationService.findAll();
  //     if (!userConversations) {
  //       throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //     }
  //     return userConversations;
  //   } catch {
  //     throw new HttpException('Error', HttpStatus.NOT_FOUND);
  //   }
  // }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const userConversation = await this.userConversationService.findById(id);
      if (!userConversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return userConversation;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() createUserConversationDto: CreateUserConversationDto) {
    try {
      await this.userConversationService.addToRoom(createUserConversationDto);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserConversationDto: CreateUserConversationDto,
  ) {
    try {
      const userConversation = await this.userConversationService.findById(id);
      if (!userConversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.userConversationService.update(
        userConversation,
        createUserConversationDto,
      );
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.userConversationService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/')
  async getUserConversations(
    @Req() req,
    @Query('offset') offset,
    @Query('limit') limit
  ) {
    console.log(offset, limit)
    try {
      const { id } = req.user
      const userConversations = await this.userConversationService.findUserConversations(id, offset, limit);
      if (!userConversations) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const result = []
      for (let uc of userConversations) {
        const latest_message = await this.conversationService.getLatestMessage(uc.conversation_id)
        result.push({
          ...uc,
          latest_message: latest_message
        })
      }

      return result;
    } catch (err) {
      console.log(err)
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  //API ADD MULTIPLE USERS (Vào chat 1v1 hoặc group chat)
  @Post('/add-many/:id')
  async addMultipleUsers(
    @Param('id') id,
    @Body() addMultipleUsersDto: AddMultipleUsersDto,
    @Res() res
  ) {
    let phones = addMultipleUsersDto.array_user_phone
    phones = [...new Set(phones)]
    console.log(id, addMultipleUsersDto)
    const conversation = await this.conversationService.findById(id)
    console.log('found conv', conversation.id)
    for (let phone of phones) {
      console.log('add user to room', phone)
      //check user exist
      const user = await this.userService.findByPhone(phone);
      if (!user) throw new HttpException(`Số điện thoại không đúng: ${phone}`, HttpStatus.BAD_REQUEST)
      //check user already in room
      const room = await this.userConversationService.findUserConversation(user.id, id)
      if (room) continue
      //add user to room
      await this.userConversationService.addToRoom({
        title: conversation.title,
        conversation_id: id,
        user_id: user.id,
        mute: false,
        block: false,
      });
      this.chatGateWay.refreshUserFriendList(user.id)
    }

    res.status(200).send()
  }

  @Get('/')
  async getRoom(@Response() res) {
    res.sendFile(process.cwd() + '/client/client.html');
  }


}
