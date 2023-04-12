import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationModule } from 'src/conversations/conversation.module';
import { ConversationService } from 'src/conversations/conversation.service';
import { ConversationRepository } from 'src/conversations/repos/conversation.repository';
import { FileModule } from 'src/files/file.module';
import { UserService } from 'src/users/user.service';
import { UserConversationModule } from 'src/user_conversation/userConversation.module';
import { UserConversationService } from 'src/user_conversation/userConversation.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageRepository } from './repos/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository]), FileModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository, ConversationService, UserConversationService],
  exports: [MessageService, MessageRepository]
})
export class MessageModule {}
