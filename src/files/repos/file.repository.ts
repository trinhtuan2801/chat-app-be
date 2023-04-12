import { File } from '../entities/file.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';

@EntityRepository(File)
export class FileRepository extends Repository<File> {}
