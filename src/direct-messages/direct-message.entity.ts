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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;
}
