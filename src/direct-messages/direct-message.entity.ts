import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, Unique, CreateDateColumn} from 'typeorm';

@Entity()
@Unique(['id'])
export class DirectMessage {
  @PrimaryGeneratedColumn() id: number;

  @Column() groupId: number;

  @Column() dmThreadId: number;

  @Column() username: string;

  @Column() userId: number;

  @Column() text: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;
}
