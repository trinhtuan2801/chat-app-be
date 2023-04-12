import { IMessage } from './message.interface';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
import { File } from '../../files/entities/file.entity';

@Entity({ name: 'messages' })
export class Message implements IMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'conversation_id' })
  conversation_id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ nullable: true, default: '' })
  user_name: string

  @Column({ default: true })
  status: boolean;

  @Column({ name: 'message', length: 255 })
  message: string;

  @Column('int', { name: 'tag_id', array: true, default: [] })
  tag_id: number[];

  @Column({ name: 'parent_message_id', nullable: true })
  parent_message_id: number;

  @Column({ name: 'file_id', nullable: true })
  file_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // @ManyToOne(() => User, (user) => user.messages)
  // @JoinColumn({ name: 'user_id' })
  // user?: User;

  // @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  // @JoinColumn({ name: 'conversation_id' })
  // conversation?: Conversation;

  // @ManyToOne(() => File, (file) => file.messages)
  // @JoinColumn({ name: 'file_id' })
  // file?: File;
}
