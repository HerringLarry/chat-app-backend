import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm';
import { Group } from 'groups/group.entity';

@Entity()
export class DirectMessageThread {
  @PrimaryGeneratedColumn() id: number;

  @Column('int', { array: true, default: '{}', nullable: false })
  userIds: number[];

  @Column() groupId: number;

}
