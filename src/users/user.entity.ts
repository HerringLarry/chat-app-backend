import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from 'profile/profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;

  @Column() password: string;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column() mobile: string;

  @Column() email: string;

  @Column({ nullable: true })
    profileId: number;

  @OneToOne(type => Profile)
  @JoinColumn()
  profile: Profile;
}