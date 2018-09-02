import { Course } from 'courses/course.entity';

export class UserInfoDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    courses: Course[];

}