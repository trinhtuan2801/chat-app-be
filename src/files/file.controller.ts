import {
  Get,
  Post,
  Body,
  Delete,
  Param,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FileService } from './file.service';
import { ParseIntPipe } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { SendFileDto } from './dto/send-file.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from 'src/users/user.service';
import { FileGuard } from './guards/file.guard';
import { Response } from 'express';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService
  ) { }

  @UseGuards(JwtGuard)
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() upload_file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {
    console.log(upload_file, upload_file.originalname)
    const file_response = await this.cloudinaryService.uploadImage(upload_file)
    const { url, resource_type: type } = file_response
    const user = await this.userService.findByPhone(req.user.phone)
    const file = await this.fileService.create({
      name: upload_file.originalname,
      url: url,
      author_id: user.id,
      createdAt: new Date(),
      type: type,
    });
    console.log(file)
    return file
  }

  // @Get('/')
  // async getAll() {
  //   try {
  //     const files = await this.fileService.findAll();
  //     if (!files) {
  //       throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //     }
  //     return files;
  //   } catch {
  //     throw new HttpException('Error', HttpStatus.NOT_FOUND);
  //   }
  // }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getById(@Param('id', ParseIntPipe) id: number) {
    try {
      const file = await this.fileService.findById(id);
      if (!file) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      const { url, type } = file
      return {
        url,
        type
      };
    } catch {
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, FileGuard)
  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.fileService.deleteById(id);
    res.status(HttpStatus.OK).send()
  }
}
