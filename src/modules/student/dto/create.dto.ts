import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  name: z.string('学生名称不能为空').describe('学生名称'),
  password: z.string('密码不能为空').min(8, '密码至少8个字符').describe('用户密码'),
  phone: z.string('手机号不能为空').max(11, '手机号必须为11位').describe('手机号'),
  cardId: z.string('身份证号不能为空').max(18, '身份证号必须为18位').describe('身份证号'),
  classId: z.number('班级ID不能为空').int('班级ID必须为整数').describe('班级ID'),
})

export class CreateDto extends createZodDto(createSchema) {}
