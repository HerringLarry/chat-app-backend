import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, Unique, CreateDateColumn} from 'typeorm';

@Entity()
@Unique(['id'])
export class DirectMessage {
  @PrimaryGeneratedColumn() id: number;

  @Column() groupId: number;

  @Column() dmThreadId: number;

  @Column() userId: number;

  @Column() text: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column('int', { array: true, default: '{}', nullable: false }) // Who's read the message
  userIds: number[];
}
