import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn() id: number;

  @Column() userId: number;

  @Column() showUsername: boolean; // if false then shows full name

  @Column({nullable: true}) showNotifications: boolean;

  @Column({nullable: true}) showTime: boolean;

  @Column({nullable: true}) highlightUsername: boolean;
}
