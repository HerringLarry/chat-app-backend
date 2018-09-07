import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(type => User, user => user.profile)
  user: User;

  @Column()
  bio: string;

  @Column()
  interests: string;
}