import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    isbn: z.string('').trim().optional().describe('ISBN号'),
    name: z.string('').trim().optional().describe('书名'),
    subname: z.string('').trim().optional().describe('副标题'),
    originalName: z.string('').trim().optional().describe('原名'),
    author: z.string('').trim().optional().describe('作者'),
    publisher: z.string('').trim().optional().describe('出版社'),
    publicationYear: z.number('').int('出版年份必须为整数').optional().describe('出版年份'),
    stock: z.number('').int('库存必须为整数').gte(0).optional().describe('库存'),
    description: z.string('').trim().optional().describe('描述'),
  })
  .refine(data => !Object.values(data).some(value => value !== ''), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}
export type UpdateType = z.infer<typeof updateSchema>
