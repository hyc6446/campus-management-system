import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateRuleConfigSchema = z.object({
  rule: z.string('规则名称不能为空'),
  type: z.enum(['action','subject'],'无效的规则类型').default('action'),
})

export type CreateRuleConfigDto = z.infer<typeof CreateRuleConfigSchema>

export class CreateRuleConfigDtoSwagger {
  @ApiProperty({
    example: 'READ',              // 文档中显示的示例值
    description: '规则名称',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  rule = 'READ';
  @ApiProperty({
    example: 'action',              // 文档中显示的示例值
    description: '规则类型',       // 文档中显示的字段描述
    enum: ['action','subject'],      // 枚举值
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  type = 'action';
}
