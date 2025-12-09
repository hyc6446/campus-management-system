import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { MinioModule } from '@core/minio/minio.module';
import { CaslModule } from '@core/casl/casl.module';

@Module({
  imports: [
    MinioModule,   // 用于文件上传
    CaslModule,    // 用于权限控制
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}