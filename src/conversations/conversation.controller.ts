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
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from 'src/users/user.service';
import { MessageService } from 'src/messages/message.service';
import { ConversationType } from './enum/UserConversation.enum';
import { ChatGateWay } from 'src/gatewaies/chat.gateway';
import { FileService } from 'src/files/file.service';

@UseGuards(JwtGuard)
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userConversationService: UserConversationService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly chatGateWay: ChatGateWay,
    private readonly fileService: FileService
  ) { }


  @Get('/')
  async getall() {
    try {
      const conversations = await this.conversationService.findAll();
      if (!conversations) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return conversations;
    } catch {
      throw new HttpException('Error', HttpStatus.NOT_FOUND);
    }
  }

  //API TAO 1-1 CHAT
  @Post('friend-chat')
  async createFriendChat(
    @Req() req,
    @Res() res,
    @Body() body,
  ) {
    const author_id = req.user.id
    const { friend_phone, message } = body
    const author = await this.userService.findById(author_id)
    const friend = await this.userService.findByPhone(friend_phone)

    await this.userConversationService.findCommmonRooms(author_id, friend.id)
    if (friend.id === author_id) throw new HttpException('Đây là số của bạn', HttpStatus.CONFLICT)

    if (!friend) throw new HttpException('Wrong phone number', HttpStatus.CONFLICT)

    const common_rooms = await this.userConversationService.findCommmonRooms(author_id, friend.id)
    for (const common_room of common_rooms) {
      const room = await this.conversationService.findById(common_room.conversation_id)
      if (room.type === ConversationType.FRIEND) throw new HttpException('Liên hệ đã tồn tại', HttpStatus.BAD_REQUEST)
    }

    try {

      //tao conversation
      const conversation = await this.conversationService.createRoom({
        title: friend.name,
        author_id: author_id,
        description: '',
        type: ConversationType.FRIEND
      })
      //them friend vao room
      await this.userConversationService.addToRoom({
        title: author.name,
        user_id: friend.id,
        conversation_id: conversation.id,
        block: false,
        mute: false,
      })
      //them message dau tien
      await this.messageService.create({
        user_id: author_id,
        user_name: author.name,
        conversation_id: conversation.id,
        message: message,
        status: true
      })
      this.chatGateWay.refreshUserFriendList(friend.id)
      res.status(HttpStatus.OK).send()

    } catch (err) {
      console.log(err)
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //API TAO GROUP CHAT
  @Post('group-chat')
  async createGroupChat(
    @Req() req,
    @Res() res,
    @Body() body,
  ) {
    const author_id = req.user.id
    const { title, description } = body
    const author = await this.userService.findById(author_id)
    console.log(author.name)
    try {

      //tao conversation
      await this.conversationService.createRoom({
        title: title,
        author_id: author_id,
        description: description,
        type: ConversationType.GROUP
      })

      res.status(HttpStatus.OK).send()

    } catch (err) {
      console.log(err)
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  //API LAY TAT CA MESSAGE TU CONVERSATION
  @Get('/:id/messages')
  async getConversationMessages(
    @Param('id') id,
    @Query('offset') offset,
    @Query('limit') limit
  ) {
    const messages = await this.messageService.getByConversationId(Number(id), offset, limit)
    const results = []
    for (const message of messages) {
      let parent_message = null
      let file = null
      if (message.parent_message_id) {
        parent_message = await this.messageService.findById(message.parent_message_id)
      }
      if (message.file_id) {
        file = await this.fileService.findById(message.file_id)
      }
      results.push({ ...message, parent_message, file })
    }
    return results.reverse()
  }

  @Get('/:id/pinned-message')
  async getPinnedMessage(
    @Param('id') id
  ) {
    return this.conversationService.getPinnedMessage(id)
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const conversation = await this.conversationService.findById(id);
      if (!conversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return conversation;
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // async create(@Body() createConversationDto: CreateConversationDto) {
  //   try {
  //     await this.conversationService.create(createConversationDto);
  //   } catch {
  //     throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Post('test')
  test(@Res() res) {
    res.status(200).send()
  }

  @Post('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateConversation(
    @Param('id', ParseIntPipe) id: number,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    try {
      const conversation = await this.conversationService.findById(id);
      if (!conversation) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return await this.conversationService.update(
        conversation,
        createConversationDto,
      );
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteConversation(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.conversationService.deleteById(id);
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
