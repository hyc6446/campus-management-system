import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const PreviewFileSchema = z.object({
  fileName: z.uuidv4('文件名不能为空').trim().describe('文件名'),
})

export class PreviewFileDto extends createZodDto(PreviewFileSchema) {}

// 导出类型供其他地方使用
export type PreviewFileType = z.infer<typeof PreviewFileSchema>
