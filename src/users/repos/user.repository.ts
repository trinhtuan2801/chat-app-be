import { User } from '../entities/user.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
