import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationRepository } from './repos/conversation.repository';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { IConversation } from './interfaces/conversation.interface';
import { UserConversationService } from 'src/user_conversation/userConversation.service';
import { Connection } from 'typeorm';
import { MessageService } from 'src/messages/message.service';
import { ConversationType } from './enum/UserConversation.enum';
import { FileService } from 'src/files/file.service';

@Injectable()
export class ConversationService {
  private conversationRepository: ConversationRepository
  constructor(
    private readonly connection: Connection,
    private userConversationService: UserConversationService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    private fileService: FileService
  ) {
    this.conversationRepository = this.connection.getCustomRepository(ConversationRepository)
  }

  async findAll(): Promise<Conversation[]> {
    return await this.conversationRepository.find();
  }

  async create(
    data: IConversation,
  ): Promise<Conversation> {
    const conversation = new Conversation();
    conversation.title = data.title;
    conversation.description = data.description;
    conversation.type = data.type
    conversation.last_message_id = null;
    conversation.pinned_message_id = null;
    conversation.author_id = data.author_id;
    conversation.createdAt = new Date();
    conversation.updatedAt = new Date();
    return await this.conversationRepository.save(conversation);
  }

  async findById(
    id: number,
    relations: string[] = [],
  ): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations,
    });
  }

  async update(
    conversation: Conversation,
    createConversationDto: CreateConversationDto,
  ) {
    conversation.updatedAt = new Date();
    return await this.conversationRepository.update(
      conversation,
      createConversationDto,
    );
  }

  async deleteById(id: number): Promise<void> {
    await this.conversationRepository.delete({ id });
  }

  async findByTitle(
    title: string,
    relations: string[] = [],
  ): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { title },
      relations,
    });
  }

  async updateLastMessage(conversation_id: number, last_messages_id: number) {
    return await this.conversationRepository.update(conversation_id, {
      last_message_id: last_messages_id,
      updatedAt: new Date()
    });
  }

  async createRoom(room_info: { author_id?: any; title?: any; description?: any; type: ConversationType }) {
    const { author_id, title, description, type } = room_info
    //tao room
    const conversation = await this.create({
      title: type === ConversationType.FRIEND ? '' : title,
      description: description || '',
      author_id: author_id,
      type: type
    });
    // them author vao room
    await this.userConversationService.addToRoom({
      title: title,
      user_id: author_id,
      conversation_id: conversation.id,
      mute: false,
      block: false,
    })

    return conversation
  }

  async getLatestMessage(conversation_id: number) {
    const conversation = await this.findById(conversation_id)
    const latest_message = await this.messageService.findById(conversation.last_message_id)
    const file = await this.fileService.findById(latest_message?.file_id)
    return {
      ...latest_message,
      file
    }
  }

  async pinMessage(conversation_id: number, message_id: number | null) {
    if (message_id === null) {
      await this.conversationRepository.update(conversation_id, {
        pinned_message_id: null,
        updatedAt: new Date()
      })
      return null
    }
    const message = await this.messageService.findById(message_id)
    const conversation = await this.findById(conversation_id)
    if (!message || !conversation || message.conversation_id !== conversation_id) {
      throw new HttpException('Message doesn\'t belong to conversation', HttpStatus.BAD_REQUEST)
    }
    await this.conversationRepository.update(conversation_id, {
      pinned_message_id: message_id,
      updatedAt: new Date()
    })
    return message
  }

  async getPinnedMessage(conversation_id: number) {
    const conversation = await this.findById(conversation_id)
    const pinnedMessageId = conversation.pinned_message_id
    if (!pinnedMessageId) return null
    const pinnedMessage = this.messageService.findById(pinnedMessageId)
    return pinnedMessage
  }
}
