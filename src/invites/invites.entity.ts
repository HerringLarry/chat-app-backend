import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Invite {
  @PrimaryGeneratedColumn() id: number;

  @Column() fromUserId: number;

  @Column() toUserId: number;

  @Column() groupId: number;
}
