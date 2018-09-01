import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Course } from '../courses/course.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column('Username') username: string;

  @Column('FirstName') firstName: string;

  @Column('LastName') lastName: string;

  @Column('mobile') mobile: string;

  @Column('email') email: string;

  @OneToMany(type => Course, (course: Course) => course.username)
    courses: Course[];
}