import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RedisModule } from '@app/core/redis/redis.module';
import { LoggerModule } from '@app/core/logger/logger.module';
import { AuthCoreModule } from '@app/core/auth/auth.module';

@Module({
  imports: [RedisModule, LoggerModule, AuthCoreModule],
  providers: [SocketService],
  exports: [SocketService],
})
export class SocketModule {}
