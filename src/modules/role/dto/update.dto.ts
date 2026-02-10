import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const UpdateSchema = z.object({
  name: z
    .string('角色名称不能为空')
    .min(2, '角色名称不能少于2个字符')
    .trim()
    .toUpperCase()
    .describe('角色名称'),
})

export class UpdateDto extends createZodDto(UpdateSchema) {}
