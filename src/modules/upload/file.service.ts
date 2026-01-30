import { Injectable, HttpStatus } from '@nestjs/common'
import { AppException } from '@app/common/exceptions/app.exception'
import { MinioService } from '@app/core/minio/minio.service'
import { Express } from 'express'
import { Readable } from 'stream'
import { MultiFilesDto, PreviewFileDto } from './dto'

@Injectable()
export class FileService {
  constructor(private readonly minioService: MinioService) {}

  /**
   * 上传文件
   * @param file 文件对象
   * @param userId 用户ID
   * @param fileType 文件类型
   * @returns 文件URL
   */
  async uploadFile(
    file: Express.Multer.File,
    userId: number,
    fileType: string = 'user-avatars'
  ): Promise<string> {
    try {
      return await this.minioService.uploadFile(file, `${fileType}/${userId}`)
    } catch (error: any) {
      throw new AppException(
        '上传文件失败',
        'FILE_UPLOAD_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message
      )
    }
  }

  /**
   * 获取文件预览URL
   * @param fileName 文件名称（包含路径）
   * @returns 文件预览URL
   */
  async getPreviewUrl(fileName: string): Promise<string> {
    try {
      const isExist = await this.minioService.fileExists(fileName)
      if (!isExist) {
        throw new AppException('文件不存在', 'FILE_NOT_FOUND', HttpStatus.BAD_REQUEST)
      }
      return await this.minioService.getFileUrl(fileName);
    } catch (error: any) {
      throw new AppException(
        '获取文件预览URL失败',
        'FILE_PREVIEW_URL_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message
      )
    }
  }
  /**
   * 获取批量文件预览URL
   * @param fileNames 文件名称列表（包含路径）
   * @returns 文件预览URL列表
   */
  async getMultiPreviewUrls(fileNames: string): Promise<string[]> {
    try {
      const files = fileNames.split(',').filter(fileName => fileName.trim() !== '');
      if (files.length === 0) {
        return [];
      }
      return await Promise.all(
        files.map(fileName => this.getPreviewUrl(fileName))
      )
    } catch (error: any) {
      throw new AppException(
        '获取预览URL失败',
        'MULTI_FILE_PREVIEW_URL_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message
      )
    }
  }

  /**
   * 下载文件
   * @param fileName 文件名称（包含路径）
   * @returns 文件流
   */
  async downloadFile(fileName: string): Promise<Readable> {
    try {
      const isExist = await this.minioService.fileExists(fileName)
      if (!isExist) {
        throw new AppException('文件不存在', 'FILE_NOT_FOUND', HttpStatus.BAD_REQUEST)
      }
      return await this.minioService.downloadFile(fileName)
    } catch (error: any) {
      throw new AppException(
        '下载文件失败',
        'FILE_DOWNLOAD_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message
      )
    }
  }
}
