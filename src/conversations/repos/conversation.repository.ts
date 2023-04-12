import { Conversation } from '../entities/conversation.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';

@EntityRepository(Conversation)
export class ConversationRepository extends Repository<Conversation> {}
