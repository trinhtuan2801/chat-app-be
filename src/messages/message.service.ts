import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRepository } from './repos/message.repository';
import { Message } from './interfaces/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { IMessage } from './interfaces/message.interface';
import { Connection, LessThan, MoreThan, Repository } from 'typeorm';
import { ConversationService } from 'src/conversations/conversation.service';
import { FileService } from 'src/files/file.service';

@Injectable()
export class MessageService {
  private messageRepository: MessageRepository

  constructor(
    private readonly connection: Connection,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
    // @InjectRepository(Message)
    // private messageRepository: Repository<Message>
    private fileService: FileService
  ) {
    this.messageRepository = this.connection.getCustomRepository(MessageRepository)
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = new Message();
    message.conversation_id = createMessageDto.conversation_id;
    message.user_id = createMessageDto.user_id;
    message.user_name = createMessageDto.user_name
    message.status = createMessageDto.status;
    message.message = createMessageDto.message;
    message.parent_message_id = createMessageDto.parent_message_id || null
    message.file_id = createMessageDto.file_id || null
    message.createdAt = new Date();
    message.updatedAt = new Date();
    const result = await this.messageRepository.save(message);
    await this.conversationService.updateLastMessage(createMessageDto.conversation_id, result.id)
    return result
  }

  async findById(id: number) {
    const message = await this.messageRepository.findOne({ id });
    if (!message) return null
    let file = null
    if (message.file_id) {
      file = await this.fileService.findById(message.file_id)
    }
    return {
      ...message,
      file
    }
  }

  async getByConversationId(id: number, offset, limit) {
    // return await this.messageRepository.find({
    //   order: { createdAt: 'DESC' },
    //   where: {
    //     conversation_id: id,
    //     createdAt: LessThan(new Date(startDate))
    //   },
    //   skip: offset,
    //   take: limit,
    // })
    return await this.messageRepository
      .createQueryBuilder('message')
      .orderBy('message.createdAt', 'DESC')
      .andWhere('message.conversation_id = :id', { id })
      .skip(offset)
      .take(limit)
      .getMany()
  }

  async update(message: Message, createMessageDto: IMessage) {
    createMessageDto.updatedAt = new Date();
    return await this.messageRepository.update(message, createMessageDto);
  }

  async deleteById(id: number): Promise<void> {
    await this.messageRepository.delete({ id });
  }
}
