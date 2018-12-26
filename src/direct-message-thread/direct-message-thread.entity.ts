import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm';
import { Group } from 'groups/group.entity';

@Entity()
export class DirectMessageThread {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @Column() groupId: number;

}
