import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn() id: number;

  @Column() courseName: string;

  @ManyToOne(type => User, user => user.courses)
  user: User;

}