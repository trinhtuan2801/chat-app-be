import { UserConversation } from '../entities/userConversation.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserConversation)
export class UserConversationRepository extends Repository<UserConversation> {}
