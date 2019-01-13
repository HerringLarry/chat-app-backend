import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;

  @Column() threadId: number;

  @Column() groupId: number;

  @Column() notifications: number;
}
