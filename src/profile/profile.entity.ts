import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'users/user.entity';
import { Piece } from 'pieces/piece.entity';

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