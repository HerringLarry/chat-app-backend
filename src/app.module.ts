import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from 'courses/courses.module';

@Module({
  imports: [UsersModule,
    CoursesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'usermgmt',
      entities: ['src/**/**.entity{.ts,.js}'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
