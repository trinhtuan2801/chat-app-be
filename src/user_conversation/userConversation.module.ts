import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from 'src/conversations/conversation.service';
import { FileModule } from 'src/files/file.module';
import { MessageService } from 'src/messages/message.service';
import { MessageRepository } from 'src/messages/repos/message.repository';
import { UserService } from 'src/users/user.service';
import { UserConversationRepository } from './repos/userConversation.repository';
import { UserConversationController } from './userConversation.controller';
import { UserConversationService } from './userConversation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserConversationRepository]), FileModule],
  controllers: [UserConversationController],
  providers: [UserConversationService, UserConversationRepository, ConversationService, MessageService, UserService, MessageRepository],
  exports: [UserConversationService, UserConversationRepository],
})
export class UserConversationModule {}
