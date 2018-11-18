import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne} from 'typeorm';
import { Group } from 'groups/group.entity';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @OneToOne(type => Group​​)
  @JoinColumn()
    group: Group;
}
