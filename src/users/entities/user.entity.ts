import { IUser } from '../interfaces/user.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from '../../messages/interfaces/message.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { UserConversation } from '../../user_conversation/entities/userConversation.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25, nullable: true })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({ name: 'phone', length: 255, nullable: true })
  phone: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Exclude()
  @Column({ nullable: true, default: '' })
  refresh_token: string

  @OneToMany(
    () => UserConversation,
    (userConversation) => userConversation.user,
  )
  userConversation?: UserConversation[];

  // @OneToMany(() => Message, (message) => message.user)
  // messages?: Message[];

  // @ManyToMany(() => Conversation, (conversations) => conversations.users)
  // conversations: Conversation[];
}
