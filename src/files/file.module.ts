import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UserRepository } from 'src/users/repos/user.repository';
import { UserService } from 'src/users/user.service';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileRepository } from './repos/file.repository';
@Module({
  imports: [TypeOrmModule.forFeature([FileRepository])],
  controllers: [FileController],
  providers: [FileService, CloudinaryService, UserService, UserRepository],
  exports: [FileModule, FileService, CloudinaryService]
})
export class FileModule { }
