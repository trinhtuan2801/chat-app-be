import { IFile } from '../interfaces/file.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Message } from '../../messages/interfaces/message.entity';

@Entity({ name: 'files' })
export class File implements IFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  url: string;

  @Column()
  type: string

  @Column()
  author_id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  // @OneToMany(() => Message, (message) => message.file)
  // messages?: Message[];
}
