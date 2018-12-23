import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm';
import { Group } from 'groups/group.entity';

@Entity()
export class DirectMessageThread {
  @PrimaryGeneratedColumn() id: number;

  @Column() groupId: number;

  @Column('int', { array: true, nullable: true })
  userIds: number[];
}
