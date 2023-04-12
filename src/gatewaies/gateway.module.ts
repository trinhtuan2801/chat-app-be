import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { FileModule } from 'src/files/file.module';
import { FileService } from 'src/files/file.service';
import { ConversationService } from '../conversations/conversation.service';
import { ConversationRepository } from '../conversations/repos/conversation.repository';
import { MessageService } from '../messages/message.service';
import { MessageRepository } from '../messages/repos/message.repository';
import { UserRepository } from '../users/repos/user.repository';
import { UserService } from '../users/user.service';
import { UserConversationRepository } from '../user_conversation/repos/userConversation.repository';
import { UserConversationService } from '../user_conversation/userConversation.service';
import { ChatGateWay } from './chat.gateway';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      UserRepository,
      ConversationRepository,
      UserConversationRepository,
    ]),
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: process.env.JWT_SECRET_KEY,
    //     signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME }
    //   })
    // }),
    FileModule
  ],
  providers: [
    // AppGateway,
    MessageService,
    UserService,
    ConversationService,
    UserConversationService,
    ChatGateWay,
    AuthService,
    JwtService,
  ],
  controllers: [],
  exports: [ChatGateWay]
})
export class GatewayModule { }
