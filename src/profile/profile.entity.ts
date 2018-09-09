import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from 'users/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  bio: string;

  @Column()
  interests: string;

  // @OneToMany( type => Piece)
}