/**
 * MinIO文件存储服务
 * 提供对象存储功能，包括文件上传、下载、删除等操作
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService as Logger } from '@core/logger/logger.service';
import * as MinIO from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { File } from '@common/types/file.types';


/**
 * MinIO服务类
 * 实现OnModuleInit接口以在模块初始化时连接到MinIO服务器
 */
@Injectable()
export class MinioService implements OnModuleInit {
  /** MinIO客户端实例 */
  private client!: MinIO.Client;
  /** 存储桶名称 */
  private bucketName!: string;
  /** 日志记录器 */
  
  /**
   * 构造函数
   * @param configService 配置服务，用于获取MinIO相关配置
   * @param logger 日志服务，使用我们自定义的LoggerService
   */
  constructor(private configService: ConfigService, private readonly logger: Logger) {}

  /**
   * 模块初始化方法
   * 连接到MinIO服务器并初始化存储桶
   */
  async onModuleInit() {
    // 记录模块初始化日志
    
    // 获取MinIO配置
    const minioConfig = this.configService.get('minio');
    this.logger.log(`MinIO服务模块初始化`);
    this.bucketName = minioConfig.bucketName;

    // 初始化MinIO客户端
    this.client = new MinIO.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    });

    // 检查并创建存储桶
    await this.ensureBucketExists();
  }

  /**
   * 确保存储桶存在
   * 如果存储桶不存在，则创建并设置访问策略
   * @private
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      // 检查存储桶是否存在
      await this.client.bucketExists(this.bucketName);
      this.logger.log(`存储桶 ${this.bucketName} 已存在`);
    } catch (err: any) {
      // 处理存储桶不存在的情况
      if (err.code === 'NoSuchBucket') {
        this.logger.log(`创建新的存储桶: ${this.bucketName}`);
        // 创建存储桶
        await this.client.makeBucket(this.bucketName, 'us-east-1');
        
        // 设置存储桶为公开读访问
        await this.client.setBucketPolicy(
          this.bucketName,
          JSON.stringify({
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucketName}/*`],
              },
            ],
          }),
        );
        this.logger.log(`存储桶 ${this.bucketName} 已创建并配置为公开读`);
      } else {
        this.logger.error(`检查存储桶时出错: ${err.message}`);
        throw err;
      }
    }
  }

  /**
   * 上传文件到MinIO存储桶
   * @param file 文件对象，包含文件内容、名称等信息
   * @param prefix 文件路径前缀，用于组织文件结构
   * @param metadata 可选的文件元数据
   * @returns 上传后的文件访问URL
   */
  async uploadFile(
    file: File,
    prefix: string = '',
    metadata?: Record<string, string>,
  ): Promise<string> {
    // 提取文件扩展名
    const fileExtension = file.originalname.split('.').pop();
    // 生成唯一文件名，包含前缀和UUID
    const fileName = `${prefix ? prefix + '/' : ''}${uuidv4()}.${fileExtension}`;
    
    // 构建文件元数据
    const metaData = {
      'Content-Type': file.mimetype,
      ...(metadata || {}),
    };

    // 上传文件到MinIO
    this.logger.log(`开始上传文件: ${fileName}`);
    await this.client.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );
    this.logger.log(`文件上传成功: ${fileName}`);

    // 返回文件的访问URL
    return this.getFileUrl(fileName);
  }

  /**
   * 从MinIO存储桶删除文件
   * @param fileName 文件名称（包含路径）
   */
  async deleteFile(fileName: string): Promise<void> {
    this.logger.log(`开始删除文件: ${fileName}`);
    await this.client.removeObject(this.bucketName, fileName);
    this.logger.log(`文件删除成功: ${fileName}`);
  }

  /**
   * 生成文件的公共访问URL
   * @param fileName 文件名称（包含路径）
   * @returns 文件的完整访问URL
   */
  getFileUrl(fileName: string): string {
    // 获取MinIO配置
    const endPoint = this.configService.get('minio').endpoint;
    const port = this.configService.get('minio').port;
    const useSSL = this.configService.get('minio').useSSL;
    
    // 确定协议（HTTP或HTTPS）
    const protocol = useSSL ? 'https' : 'http';
    
    // 构建并返回URL
    return `${protocol}://${endPoint}:${port}/${this.bucketName}/${fileName}`;
  }

  /**
   * 生成预签名URL，用于临时访问受保护的文件
   * @param fileName 文件名称（包含路径）
   * @param expirySeconds URL过期时间（秒），默认为3600秒（1小时）
   * @returns 预签名的临时访问URL
   */
  getPresignedUrl(fileName: string, expirySeconds: number = 3600): Promise<string> {
    this.logger.log(`生成预签名URL: ${fileName}，过期时间: ${expirySeconds}秒`);
    return this.client.presignedGetObject(this.bucketName, fileName, expirySeconds);
  }

  /**
   * 获取文件流
   * @param fileName 文件名称
   * @returns 文件可读流或null（当文件不存在时）
   */
  async getFileStream(fileName: string): Promise<Readable | null> {
    try {
      this.logger.log(`获取文件流: ${fileName}`);
      return await this.client.getObject(this.bucketName, fileName);
    } catch (err: any) {
      this.logger.error(`获取文件流失败: ${fileName}`, err.stack);
      return null;
    }
  }
}