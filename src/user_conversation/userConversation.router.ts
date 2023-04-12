import { Routes } from '@nestjs/core';
import { UserConversationService } from './userConversation.service';

export const appRoutes: Routes = [
  {
    path: 'user-conversation',
    module: UserConversationService,
    children: [],
  },
];
