import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file.service';
import { MinioService } from '@app/core/minio/minio.service';
import { AppException } from '@app/common/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-12345'),
}));


describe('FileService', () => {
  let fileService: FileService;
  let minioService: jest.Mocked<MinioService>;

  beforeEach(async () => {
    // 创建模拟的MinioService
    const mockMinioService = {
      fileExists: jest.fn(),
      getFileUrl: jest.fn(),
      downloadFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: MinioService,
          useValue: mockMinioService,
        },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    minioService = module.get(MinioService) as jest.Mocked<MinioService>;
  });

  describe('getMultiPreviewUrls', () => {
    // 测试场景1：正常情况 - 多个文件名
    it('should return array of preview URLs for multiple files', async () => {
      // 模拟数据
      const fileNames = 'user-avatars/27/141af417-b748-4553-9aff-df258d77b691.jpg,/user-avatars/27/3234c0dc-d9f8-4fc0-8e74-2bc4ceeda8de.jpg,/user-avatars/27/32cd34f0-2d03-4725-85eb-90561aac0fc5.jpg';

      // 模拟getPreviewUrl方法的返回值
      const mockUrls = [
        'http://minio:9000/bucket/file1.jpg?X-Amz-Algorithm=...',
        'http://minio:9000/bucket/file2.png?X-Amz-Algorithm=...',
        'http://minio:9000/bucket/file3.pdf?X-Amz-Algorithm=...',
      ];


      // 模拟fileExists方法
      minioService.fileExists.mockResolvedValue(true);
      // 模拟getFileUrl方法
      minioService.getFileUrl
        .mockResolvedValueOnce(mockUrls[0])
        .mockResolvedValueOnce(mockUrls[1])
        .mockResolvedValueOnce(mockUrls[2]);

      // 执行测试
      const result = await fileService.getMultiPreviewUrls(fileNames);

      // 验证结果
      expect(result).toEqual(mockUrls);
    });

    // // 测试场景2：正常情况 - 单个文件名
    it('should return array with single preview URL for single file', async () => {
      // 模拟数据
      const fileNames = 'user-avatars/27/141af417-b748-4553-9aff-df258d77b691.jpg';

      // 模拟返回值
      const mockUrl = 'http://minio:9000/bucket/singleFile.jpg?X-Amz-Algorithm=...';

      // 模拟方法
      minioService.fileExists.mockResolvedValue(true);
      minioService.getFileUrl.mockResolvedValue(mockUrl);

      // 执行测试
      const result = await fileService.getMultiPreviewUrls(fileNames);

      // 验证结果
      expect(result).toEqual([mockUrl]);
    });

    // // 测试场景3：异常情况 - 空文件名
    it('should handle empty file names', async () => {
      // 模拟数据
      const fileNames = '';

      // 执行测试
      const result = await fileService.getMultiPreviewUrls(fileNames);

      // 验证结果
      expect(result).toEqual([]);
      expect(minioService.getFileUrl).not.toHaveBeenCalled();
    });

    // // 测试场景4：异常情况 - getPreviewUrl失败
    it('should throw AppException when getPreviewUrl fails', async () => {

      // 模拟数据
      const fileNames = 'user-avatars/27/141af417-b748-4553-9aff-df258d77b691.jpg,/user-avatars/27/3234c0dc-d9f8-4fc0-8e74-2bc4ceeda8de.jpg';

      // 模拟方法抛出异常
      minioService.fileExists.mockResolvedValue(true);
      minioService.getFileUrl.mockRejectedValue(new Error('MinIO error'));

      // 执行测试并验证异常
      await expect(fileService.getMultiPreviewUrls(fileNames)).rejects.toThrow(AppException);

      // 捕获异常并验证响应对象
      let caughtException: any;
      try {
        await fileService.getMultiPreviewUrls(fileNames);
      } catch (error) {
        caughtException = error;
      }

      // 验证异常的响应对象
      expect(caughtException.getResponse()).toMatchObject({
        message: '获取预览URL失败',
        errorCode: 'MULTI_FILE_PREVIEW_URL_FAILED',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});