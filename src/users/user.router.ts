import { Routes } from '@nestjs/core';
import { UserService } from './user.service';

export const appRoutes: Routes = [
  {
    path: 'users',
    module: UserService,
    children: [],
  },
];
