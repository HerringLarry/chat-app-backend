import { UsersController } from './../users/users.controller';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as passport from 'passport';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersService } from 'users/users.service';
import { DirectMessageController } from 'direct-messages/direct-message.controller';
import { DirectMessageThreadController } from 'direct-message-thread/direct-message-thread.controller';
import { GroupController } from 'groups/group.controller';
import { InvitesController } from 'invites/invites.controller';
import { ThreadController } from 'threads/thread.controller';
import { MessageController } from 'messages/message.controller';
import { SettingsModule } from 'settings/settings.module';
import { CompressionMiddleware } from '@nest-middlewares/compression';
import { HelmetMiddleware } from '@nest-middlewares/helmet';

@Module({})
export class MyModule {
  configure(consumer: MiddlewareConsumer) {
      // IMPORTANT! Call Middleware.configure BEFORE using it for routes
      HelmetMiddleware.configure( {} );
      consumer.apply(CompressionMiddleware).forRoutes(
            GroupController, DirectMessageController, DirectMessageThreadController, MessageController,
            ThreadController, UsersController, InvitesController,
            );
    }
}