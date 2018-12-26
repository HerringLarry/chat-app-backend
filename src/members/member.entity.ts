import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;

  @Column() groupId: number;

  @Column('int', { array: true, default: '{}', nullable: false })
  threads: number[];

  @Column('int', { array: true, default: '{}', nullable: false })
  directThreads: number[];
}
