import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm';
import { Thread } from 'threads/thread.entity';
import { User } from 'users/user.entity';
import { Group } from 'groups/group.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(type => Group)
  @JoinColumn()
    group: Group;

  @OneToOne(type => Thread​​)
  @JoinColumn()
    thread: Thread​​;

  @OneToOne(type => User)
  @JoinColumn()
    user: User;

  @Column() text: string;
}
