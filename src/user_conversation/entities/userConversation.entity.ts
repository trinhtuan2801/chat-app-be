import { IUserConversation } from '../interfaces/userConversation.interface';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity({ name: 'user_conversation' })
export class UserConversation implements IUserConversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  title: string

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'conversation_id' })
  conversation_id: number;

  @Column({ name: 'mute', default: false })
  mute: boolean;

  @Column({ name: 'block', default: false })
  block: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;


  @ManyToOne(() => User, (user) => user.userConversation)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // @ManyToOne(
  //   () => Conversation,
  //   (conversation) => conversation.userConversation,
  // )
  // @JoinColumn({ name: 'conversation_id' })
  // conversation?: Conversation;
}
