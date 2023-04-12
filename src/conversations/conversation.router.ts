import { Routes } from '@nestjs/core';
import { ConversationService } from './conversation.service';

export const appRoutes: Routes = [
  {
    path: 'conversations',
    module: ConversationService,
    children: [],
  },
];
