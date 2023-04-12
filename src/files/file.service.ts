import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from './repos/file.repository';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
  ) {}

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = new File();
    file.name = createFileDto.name;
    file.url = createFileDto.url;
    file.author_id = createFileDto.author_id;
    file.createdAt = createFileDto.createdAt;
    file.type = createFileDto.type
    return await this.fileRepository.save(file);
  }

  async findById(id: number): Promise<File | null> {
    return await this.fileRepository.findOne({ id });
  }

  async findByFilename(name: string): Promise<File | null> {
    return await this.fileRepository.findOne({ name });
  }

  async deleteById(id: number): Promise<void> {
    await this.fileRepository.delete({ id });
  }
}
