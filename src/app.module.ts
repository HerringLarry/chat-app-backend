import { MessageModule } from './messages/message.module';
import { ThreadModule } from 'threads/thread.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'authentication/auth.module';
import { GroupModule } from 'groups/group.module';

@Module({
  imports: [UsersModule,
    AuthModule,
    GroupModule,
    ThreadModule,
    MessageModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'williamnewman',
      password: '',
      database: 'chat',
      entities: ['src/**/**.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
