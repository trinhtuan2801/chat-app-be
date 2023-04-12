import { Routes } from '@nestjs/core';
import { FileService } from './file.service';

export const appRoutes: Routes = [
  {
    path: 'files',
    module: FileService,
    children: [],
  },
];
