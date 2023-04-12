import { Injectable, OnModuleInit, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, SubscribeMessage, WebSocketServer } from "@nestjs/websockets/decorators";
import { Server, Socket } from 'socket.io'
import { ConversationService } from "src/conversations/conversation.service";
import { FileService } from "src/files/file.service";
import { MessageService } from "src/messages/message.service";
import { UserConversationService } from "src/user_conversation/userConversation.service";
import { SocketAuthGuard } from "./guards/socket-auth.guard";
import { INewMessage } from "./interfaces/newMessage.interface";

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080']
  }
})
export class ChatGateWay implements OnModuleInit {

  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly fileService: FileService
  ) { }

  @WebSocketServer()
  server: Server

  socket_map = new Map()

  private findUserIdInMap(socket_id) {
    for (let [user_id, user_socket_id] of this.socket_map.entries()) {
      if (user_socket_id === socket_id) return user_id
    }
  }

  async onModuleInit() {
    this.server.on('connection', socket => {
      console.log(socket.id, 'Connected')
      socket.conn.on('close', () => {
        const user_id = this.findUserIdInMap(socket.id)
        console.log('remove from socket_map', user_id)
        this.socket_map.delete(user_id)
      })
    })
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('newMessage')
  async onNewMessage(
    client: Socket,
    message: INewMessage
  ) {
    console.log('conversation id:', String(message.conversation_id))
    if (message.conversation_id) {
      if (!message.message && !message.file_id) return
      const room_id = message.conversation_id.toString()
      const new_message = await this.messageService.create({
        conversation_id: message.conversation_id,
        message: message.message,
        status: true,
        user_id: message.user_id,
        user_name: message.user_name,
        parent_message_id: message.parent_message_id,
        file_id: message.file_id,
      })
      this.refreshUserFriendListInRoom(message.conversation_id)
      const parent_message = await this.messageService.findById(message.parent_message_id)
      const file = await this.fileService.findById(message.file_id)
      this.server
        .to(room_id)
        .emit('onMessage', {
          data: {
            ...new_message,
            parent_message,
            file
          }
        })
    }
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('joinRoom')
  onJoinRoom(client: Socket, data: { conversation_ids: string[] }) {
    console.log('conversation ids:', data.conversation_ids)
    client.join(data.conversation_ids)
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('joinServer')
  onConnect(client: Socket, data: { user_id: number }) {
    console.log('joinServer', data.user_id, client.id)
    this.socket_map.set(data.user_id, client.id)
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('pinMessage')
  async onPinMessage(client: Socket, data: { conversation_id: number, message_id: number }) {
    const { conversation_id, message_id } = data
    console.log('pin', conversation_id, message_id)
    const message = await this.conversationService.pinMessage(conversation_id, message_id)
    this.server.to(conversation_id.toString()).emit('onPinMessage', {
      data: {
        pinned_message: message
      }
    })
  }

  refreshUserFriendListInRoom(conversation_id: number | string) {
    this.server.to(conversation_id.toString()).emit('onRefreshFriendList')
  }

  refreshUserFriendList(user_id: number) {
    const user_socket_id = this.socket_map.get(user_id)
    if (user_socket_id) {
      this.server.to(user_socket_id).emit('onRefreshFriendList')
    }
  }

}