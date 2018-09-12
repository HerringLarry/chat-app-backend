import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  bio: string;

  @Column()
  interests: string;

  @OneToOne(type => User, user => user.id)
  user: User;

  @Column({default: 'photo'})
  profilePhoto: string;
}