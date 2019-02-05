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

  @Column({
    nullable: true,
    default: 'https://static.thenounproject.com/png/630729-200.png',
  })
  photoPath: string;
}
