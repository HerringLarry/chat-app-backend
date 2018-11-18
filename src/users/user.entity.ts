import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;

  @Column() password: string;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column() mobile: string;

  @Column() email: string;
}
