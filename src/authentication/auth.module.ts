import { CoursesController } from './../courses/courses.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import * as passport from 'passport';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersService } from 'users/users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    UsersModule,
  ],
  controllers: [ AuthController ],
  providers: [AuthService, JwtStrategy, UsersService],
})
export class AuthModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(passport.authenticate('jwt', { session: false }))
          .forRoutes(CoursesController);
    }
}