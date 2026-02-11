import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z.object({
  isbn: z.string('ISBN不能为空').trim().optional().describe('ISBN号'),
  name: z.string('书名不能为空').trim().optional().describe('书名'),
  subname: z.string('副标题不能为空').trim().optional().describe('副标题'),
  originalName: z.string('原名不能为空').trim().optional().describe('原名'),
  author: z.string('作者不能为空').trim().optional().describe('作者'),
  publisher: z.string('出版社不能为空').trim().optional().describe('出版社'),
  publicationYear: z.number('出版年份不能为空').int('出版年份必须为整数').optional().describe('出版年份'),
  stock: z.number('库存不能为空').int('库存必须为整数').optional().describe('库存'),
  description: z.string('描述不能为空').trim().optional().describe('描述'),
})

export class UpdateDto extends createZodDto(updateSchema) {}
export type UpdateType = z.infer<typeof updateSchema>
