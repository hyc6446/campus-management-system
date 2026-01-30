/**
 * MinIO文件存储服务
 * 提供对象存储功能，包括文件上传、下载、删除等操作
 */
import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PinoLogger } from 'nestjs-pino'
import * as MinIO from 'minio'
import { v4 as uuidv4 } from 'uuid'
import { Readable } from 'stream'
import { Express } from 'express'

/**
 * MinIO服务类
 * 实现OnModuleInit接口以在模块初始化时连接到MinIO服务器
 */
@Injectable()
export class MinioService implements OnModuleInit {
  /** MinIO客户端实例 */
  private client!: MinIO.Client
  /** 存储桶名称 */
  private bucketName!: string
  /** 日志记录器 */

  /**
   * 构造函数
   * @param configService 配置服务，用于获取MinIO相关配置
   * @param logger 日志服务，使用 nestjs-pino 的 PinoLogger
   */
  constructor(
    private configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    // this.logger.setContext('MinioService')
  }

  /**
   * 模块初始化方法
   * 连接到MinIO服务器并初始化存储桶
   */
  async onModuleInit() {
    // 获取MinIO配置
    const minioConfig = this.configService.get('minio')
    this.bucketName = minioConfig.bucketName

    // 初始化MinIO客户端
    this.client = new MinIO.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.port,
      useSSL: minioConfig.useSSL,
      accessKey: minioConfig.accessKey,
      secretKey: minioConfig.secretKey,
    })
    this.logger.info(`MinIO服务模块初始化`)

    // 检查并创建存储桶
    await this.ensureBucketExists()
  }

  async onDestroy() {
    this.logger.info(`MinIO服务模块关闭`)
  }
  /**
   * 确保存储桶存在
   * 如果存储桶不存在，则创建并设置访问策略
   * @private
   */
  private async ensureBucketExists(): Promise<void> {
    try {
      // 检查存储桶是否存在
      await this.client.bucketExists(this.bucketName)
      this.logger.info(`存储桶 ${this.bucketName} 已存在`)
    } catch (err: any) {
      // 处理存储桶不存在的情况
      if (err.code === 'NoSuchBucket') {
        this.logger.info(`创建新的存储桶: ${this.bucketName}`)
        // 创建存储桶
        await this.client.makeBucket(this.bucketName, 'us-east-1')

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
          })
        )
        this.logger.info(`存储桶 ${this.bucketName} 已创建并配置为公开读`)
      } else {
        this.logger.error(`检查存储桶时出错: ${err.message}`)
        throw err
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
    file: Express.Multer.File,
    prefix: string = '',
    metadata?: Record<string, string>
  ): Promise<string> {
    // 提取文件扩展名
    const fileExtension = file.originalname.split('.').pop()
    // 生成唯一文件名，包含前缀和UUID
    const fileName = `${prefix ? prefix + '/' : ''}${uuidv4()}.${fileExtension}`

    // 构建文件元数据
    const metaData = {
      'Content-Type': file.mimetype,
      ...(metadata || {}),
    }

    // 上传文件到MinIO
    const uploadResult = await this.client.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData
    )
    this.logger.info(`文件上传成功: ${fileName}, 上传结果: ${JSON.stringify(uploadResult)}`)

    return fileName
  }

  /**
   * 从MinIO存储桶删除文件
   * @param fileName 文件名称（包含路径）
   */
  async deleteFile(fileName: string): Promise<void> {
    await this.client.removeObject(this.bucketName, fileName)
    this.logger.info(`文件删除成功: ${fileName}`)
  }

  /**
   * 生成文件的公共访问URL
   * @param fileName 文件名称（包含路径）
   * @returns 文件的完整访问URL
   */
  async getFileUrl(fileName: string): Promise<string> {
    const url = await this.client.presignedGetObject(this.bucketName, fileName, 5 * 60)
    this.logger.info(`文件访问URL: ${url}`)
    return url
  }

  /**
   * 下载文件从MinIO存储桶
   * @param fileName 文件名称（包含路径）
   * @returns 文件流
   */
  async downloadFile(fileName: string): Promise<Readable> {
    const fileStream = await this.client.getObject(this.bucketName, fileName)
    this.logger.info(`文件下载成功: ${fileName}`)
    return fileStream
  }

  /**
   * 检查文件是否存在于MinIO存储桶
   * @param fileName 文件名称（包含路径）
   * @returns 文件是否存在
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucketName, fileName)
      return true
    } catch (err: any) {
      if (err.code === 'NoSuchKey') return false
      throw err
    }
  }

  /**
   * 获取文件信息
   * @param fileName 文件名称（包含路径）
   * @returns 文件信息
   */
  async getFileInfo(fileName: string): Promise<MinIO.BucketItemStat> {
    const fileInfo = await this.client.statObject(this.bucketName, fileName)
    this.logger.info(`获取文件信息成功: ${fileName}`)
    return fileInfo
  }

  /**
   * 列出存储桶中的文件
   * @param prefix 可选的文件路径前缀，用于过滤文件
   * @returns 文件列表
   */
  async listFiles(prefix?: string): Promise<MinIO.BucketItem[]> {
    const files: MinIO.BucketItem[] = []
    const stream = this.client.listObjects(this.bucketName, prefix, true)

    return new Promise((resolve, reject) => {
      stream.on('data', (file: MinIO.BucketItem) => {
        files.push(file)
      })
      stream.on('error', err => {
        reject(err)
      })
      stream.on('end', () => {
        resolve(files)
      })
    })
  }
}
