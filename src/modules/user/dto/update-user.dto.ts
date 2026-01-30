import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const UpdateUserSchema = z
  .object({
    userName: z.string().min(2, '用户名至少2个字符').optional().describe('用户姓名'),
    avatarUrl: z.url('请输入有效的URL').optional().describe('用户头像'),
    phone: z.string().optional().describe('用户手机号'),
    roleId: z.coerce.number().int('角色不能为空').optional().describe('用户角色'),
  })
  .refine(
    data => {
      // 检查手机号格式
      if (data.phone) {
        const regex = /^1[3456789]\d{9}$/
        return regex.test(data.phone)
      }
      // 检查是否有更新项
      if (!Object.values(data).some(value => value !== '')) {
        return false
      }
      return true
    },
    { message: '至少有一项更新信息' }
  )

export type UpdateUserType = z.infer<typeof UpdateUserSchema>
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
