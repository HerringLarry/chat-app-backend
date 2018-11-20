import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @Column('int', { array: true, nullable: true })
  userIds: number[];
}
