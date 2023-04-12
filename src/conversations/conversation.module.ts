import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/files/file.module';
import { FileService } from 'src/files/file.service';
import { MessageService } from 'src/messages/message.service';
import { MessageRepository } from 'src/messages/repos/message.repository';
import { UserService } from 'src/users/user.service';
import { UserConversationRepository } from 'src/user_conversation/repos/userConversation.repository';
import { UserConversationService } from 'src/user_conversation/userConversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './repos/conversation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationRepository]),
    FileModule
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ConversationRepository,
    UserConversationService,
    MessageService,
    UserService,
    MessageRepository,
  ],
  exports: [ConversationService, ConversationRepository],
})
export class ConversationModule { }
