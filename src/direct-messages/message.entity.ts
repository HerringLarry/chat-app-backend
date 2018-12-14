import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, Unique, CreateDateColumn} from 'typeorm';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';

@Entity()
@Unique(['id'])
export class Message {
  @PrimaryGeneratedColumn() id: number;

  @Column() groupId: number;

  @Column() threadId: number;

  @Column() username: string;

  @Column() userId: number;

  @Column() text: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;
}
