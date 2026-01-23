import { Exclude } from 'class-transformer'
import { Role } from '@modules/role/role.entity'

// 用户实体类 - 与Prisma schema保持一致
export class User {
  // 自增ID，与Prisma schema匹配
  id: number

  // 邮箱，唯一约束
  email: string

  // 密码，序列化时排除
  @Exclude()
  password: string

  // 用户名，替代原来的name字段
  userName: string | null

  // 头像URL
  avatarUrl: string | null

  // 电话号码
  phone: string | null

  // 角色ID，与Prisma schema中的roleId字段对应
  roleId: number

  // 角色名称
  role: Role

  // 失败登录尝试次数
  failedLoginAttempts: number = 0

  // 账户锁定时间
  lockUntil: Date | null

  // 创建时间
  createdAt: Date

  // 更新时间
  updatedAt: Date

  // 软删除时间戳
  deletedAt: Date | null

  // 班级ID列表，用于教师角色关联多个班级
  // classIds?: number[];

  // 班级ID，用于学生角色关联单个班级
  // classId?: number;

  // 子用户ID列表，用于CASL权限控制
  // childrenIds?: number[];


  // 构造函数初始化默认值
  constructor(partial: any = {}) {
    this.id = partial.id || 0
    this.email = partial.email || ''
    this.password = partial.password || ''
    this.userName = partial.userName ?? null
    this.avatarUrl = partial.avatarUrl ?? null
    this.phone = partial.phone ?? null
    this.roleId = partial.role?.roleId || partial.role?.id || 0
    this.role = partial.role || new Role({ id: this.roleId, name: '' })
    this.createdAt = partial.createdAt || new Date()
    this.updatedAt = partial.updatedAt || new Date()
    this.deletedAt = partial.deletedAt ?? null
    this.failedLoginAttempts = partial.failedLoginAttempts ?? 0
    this.lockUntil = partial.lockUntil ?? undefined
    // this.classIds = partial.classIds ?? undefined;
    // this.classId = partial.classId ?? undefined;
    // this.childrenIds = partial.childrenIds ?? undefined;
  }
}
