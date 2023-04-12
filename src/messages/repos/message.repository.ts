import { Message } from '../interfaces/message.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  // transform(model: Message): MessageEntity {
  //   return plainToClass(
  //     MessageEntity,
  //     classToPlain(model),
  //   )
  // }
}
