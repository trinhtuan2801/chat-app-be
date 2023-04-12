import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConversationRepository } from './repos/userConversation.repository';
import { UserConversation } from './entities/userConversation.entity';
import { CreateUserConversationDto } from './dto/create-userConversation.dto';
import { IUserConversation } from './interfaces/userConversation.interface';
import { Connection } from 'typeorm';

@Injectable()
export class UserConversationService {
  private userConversationRepository: UserConversationRepository

  constructor(
    private readonly connection: Connection,
  ) {
    this.userConversationRepository = this.connection.getCustomRepository(UserConversationRepository)
  }

  async findAll(): Promise<UserConversation[]> {
    return await this.userConversationRepository.find();
  }

  async addToRoom(
    createUserConversationDto: CreateUserConversationDto,
  ): Promise<UserConversation> {
    const userConversation = new UserConversation();
    userConversation.title = createUserConversationDto.title
    userConversation.conversation_id = createUserConversationDto.conversation_id;
    userConversation.user_id = createUserConversationDto.user_id;
    userConversation.mute = createUserConversationDto.mute;
    userConversation.block = createUserConversationDto.block;
    userConversation.createdAt = new Date();
    userConversation.updatedAt = new Date();
    return await this.userConversationRepository.save(userConversation);
  }

  async findById(id: number): Promise<UserConversation | null> {
    return await this.userConversationRepository.findOne({ id });
  }

  async update(
    userConversation: UserConversation,
    updateData: IUserConversation,
  ) {
    updateData.updatedAt = new Date();
    return await this.userConversationRepository.update(
      userConversation,
      updateData,
    );
  }

  async deleteById(id: number): Promise<void> {
    await this.userConversationRepository.delete({ id });
  }

  async findUsers(conversation_id: number) {
    const usersConversation = await this.userConversationRepository.find({
      conversation_id,
    });
    const usersId = usersConversation.map((item) => {
      return item.user_id;
    });
    return usersId;
  }

  async findUserConversations(user_id: number, offset, limit) {
    const userConversations = await this.userConversationRepository.find({
      where: { user_id },
      skip: offset,
      take: limit
    });

    return userConversations;
  }

  async findUserConversation(user_id: number, conversation_id: number) {
    const userConversation = await this.userConversationRepository.findOne({
      where: {
        user_id,
        conversation_id
      }
    })
    return userConversation
  }

  async getUsersInConversation(conversation_id: number) {
    const ucs = await this.userConversationRepository.find({
      where: {
        conversation_id
      }
    })
    return ucs.map((uc) => uc.user_id)
  }

  async findCommmonRooms(user1_id: number, user2_id: number): Promise<UserConversation[]> {
    let results: UserConversation[] = []
    const user1_rooms = await this.findUserConversations(user1_id, 0, 0)
    for (const user1_room of user1_rooms) {
      if (await this.findUserConversation(user2_id, user1_room.conversation_id))
        results.push(user1_room)
    }
    return results
  }
}
