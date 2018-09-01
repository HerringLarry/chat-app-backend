import { Injectable } from '@nestjs/common';

@Injectable()
export class CoursesService {

  async findAll(): Promise<string> {
    return 'hello';
  }
}