import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from 'courses/course.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column() username: string;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column() mobile: string;

  @Column() email: string;

  @OneToMany(type => Course, (course: Course) => course.user)
    courses: Course[];
}