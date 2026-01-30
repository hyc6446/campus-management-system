import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Get,
  Res,
  Query,
  UseGuards,
  ParseArrayPipe,
} from '@nestjs/common'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { Express, Response } from 'express'
import { FileService } from './file.service'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { AppException } from '@app/common/exceptions/app.exception'


@ApiTags('文件上传')
@Controller('upload')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.OK, description: '文件上传成功', type: Object })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    fileType?: string
  ) {
    return await this.fileService.uploadFile(file, user.id, fileType)
  }

  @ApiOperation({ summary: '获取文件预览地址' })
  @ApiResponse({ status: HttpStatus.OK, description: '文件预览地址' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '文件不存在' })
  @Get('secure')
  async getPreviewUrl(@Query('fileName') fileName: string) {
    return await this.fileService.getPreviewUrl(fileName)
  }

  @ApiOperation({ summary: '批量获取文件预览地址' })
  @ApiResponse({ status: HttpStatus.OK, description: '文件预览地址' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '文件不存在' })
  @Get('many')
  async getMultiPreviewUrl(@Query('fileNames') fileNames: string) {
    return await this.fileService.getMultiPreviewUrls(fileNames)
  }

  @ApiOperation({ summary: '文件下载' })
  @ApiResponse({ status: HttpStatus.OK, description: '文件下载成功', type: Object })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '文件不存在' })
  @UseInterceptors(FileInterceptor('file'))
  @Get('download')
  async downloadFile(@Query('fileName') fileName: string, @Res() res: Response) {
    try {
      // 获取文件流
      const fileStream = await this.fileService.downloadFile(fileName)
      // 设置响应头
      res.setHeader('Content-Type', 'application/octet-stream')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(fileName.split('/').pop() || 'file')}"`
      )
      fileStream.pipe(res)
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
