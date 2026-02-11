import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// 规则配置列表项
const RuleConfigItemSchema = z.object({
  id: z.number().describe('规则配置ID'),
  rule: z.string().describe('规则'),
  type: z.string().describe('类型'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(RuleConfigItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(RuleConfigItemSchema)) {}


