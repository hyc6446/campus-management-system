import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const MultiFilesSchema = z.object({
  fileNames: z.string('文件名不能为空').trim().describe('文件名列表，多个文件名用逗号分隔'),
})

export class MultiFilesDto extends createZodDto(MultiFilesSchema) {}

// 导出类型供其他地方使用
export type MultiFilesType = z.infer<typeof MultiFilesSchema>
