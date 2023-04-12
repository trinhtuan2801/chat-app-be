import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MessageService } from '../messages/message.service';
import { ConversationService } from '../conversations/conversation.service';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { HttpException, HttpStatus } from '@nestjs/common';


@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000']
  }
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server;

  private logger = new Logger('MessageGateway');

  private ListOnlineUsers = [];

  constructor(
    private messageService: MessageService,
    private conversationService: ConversationService,
    private userConversationService: UserConversationService,
  ) {}

  afterInit(server: Server) {
    console.log('Init');
  }


  async handleConnection(socket: Socket) {
    this.logger.log(`${socket.id} connect`);
    return
    // const client: any = socket;
    // const passport = client.handshake.session.passport;
    // const userId = passport.user.id;
    // const username = passport.user.name;
    // const conversations = await this.userConversationService.findConversations(
    //   userId,
    //   ['conversation'],
    // );
    // const conversationsCustom = conversations.map((item) => {
    //   return {
    //     id: item.id,
    //     title: item.title,
    //     last_message_id: item.last_message_id,
    //   };
    // });
    // socket.emit('conversations', conversationsCustom);
    // this.ListOnlineUsers.push(username);
    // this.server.emit('users', this.ListOnlineUsers);
    // for (const item of conversationsCustom) {
    //   socket.join(String(item.id));
    //   const message = await this.messageService.findById(item.last_message_id);
    //   // Send last messages to the connected user
    //   socket.emit('message', { ...message, room: String(item.id) });
    // }
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log(`${socket.id} disconnect`);
    const client: any = socket;
    const passport = client.handshake.session.passport;
    const userId = passport.user.id;
    const username = passport.user.name;
    const index = this.ListOnlineUsers.indexOf(username);
    if (index > -1) {
      this.ListOnlineUsers.splice(index, 1); //remove one item only
    }
    this.logger.log(`Online: ${this.ListOnlineUsers}`);
    this.server.emit('users', this.ListOnlineUsers);
  }

  @SubscribeMessage('message')
  async onMessage(socket: Socket, data) {
    const event = 'message';
    const client: any = socket;
    const passport = client.handshake.session.passport;
    const userId = passport.user.id;
    const username = passport.user.name;
    const message = await this.messageService.create({
      user_id: userId,
      status: true,
      message: data.message,
      conversation_id: data.conversation_id,
    });
    const messageId = message.id;
    await this.conversationService.updateLastMessage(
      data.conversation_id,
      messageId,
    );
    this.server
      .to(String(data.conversation_id))
      .emit(event, { ...message, room: data.conversation_id });
  }

  // @SubscribeMessage('create')
  // async onRoomCreate(client, data: any): Promise<any> {
  //   client.join(data.room);
  // }

  @SubscribeMessage('leave')
  onRoomLeave(client, room: any): void {
    client.leave(room);
  }
}
