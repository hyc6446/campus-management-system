import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'

const BookItemSchema = z.object({
  id: z.number().describe('图书ID'),
  isbn: z.string().describe('ISBN'),
  name: z.string().describe('图书名称'),
  subname: z.string().describe('副标题'),
  originalName: z.string().describe('原作名'),
  author: z.string().describe('作者'),
  publisher: z.string().describe('出版社'),
  publicationYear: z.number().describe('出版年份'),
  stock: z.number().describe('库存'),
  description: z.string().describe('描述'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(BookItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(BookItemSchema)) {}
