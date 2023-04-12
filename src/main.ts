import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import { EventsAdapter } from './gatewaies/adapters/ws-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new EventsAdapter(app));
  app.enableCors()
  app.setGlobalPrefix('api')
  await app.listen(process.env.PORT);
}
bootstrap();
