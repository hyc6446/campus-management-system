import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MinioModule } from '@core/minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
