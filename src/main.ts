import { AuthMiddleware } from './auth.middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const dotenv =  require('dotenv').config('/Users⁩/williamnewman⁩/note-taker⁩/note-taker-backend⁩/note-taker-backend/.env');
  const app = await NestFactory.create(AppModule);
  const cors = require('cors');
  app.use(cors({origin: 'http://localhost:4200'}));
  await app.listen(3000);
}
bootstrap();
