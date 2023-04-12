import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './messages/message.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import config from '../ormconfig';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppGateway } from './gatewaies/app.gateway';
import { join } from 'path';
import { GatewayModule } from './gatewaies/gateway.module';
import { ConversationModule } from './conversations/conversation.module';
import { UserConversationModule } from './user_conversation/userConversation.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { FileModule } from './files/file.module';
import { Session } from './auth/sessions/sessions.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    MessageModule,
    UserModule,
    AuthModule,
    ConversationModule,
    UserConversationModule,
    GatewayModule,
    FileModule,
    TypeOrmModule.forFeature([Session]),
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
