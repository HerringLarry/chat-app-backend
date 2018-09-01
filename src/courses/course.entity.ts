import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn() id: number;

  @Column('Username') username: string;

  @Column('CourseName') courseName: string;
}