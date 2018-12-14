import { IoAdapter } from '@nestjs/websockets';
import * as redisIoAdapter from 'socket.io-redis';

const redisAdapter = redisIoAdapter({ host: 'localhost', port: 4000 });

export class RedisIoAdapter extends IoAdapter {

  createIOServer(port: number, options?: any): any {
    console.log('hello');
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
    }
}
