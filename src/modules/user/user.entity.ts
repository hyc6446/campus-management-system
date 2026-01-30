import { Exclude } from 'class-transformer'
import { Role } from '@modules/role/role.entity'

export class User {
  id: number
  email: string
  @Exclude()
  password: string
  userName: string | null
  avatarUrl: string | null
  phone: string | null
  roleId: number
  role: Role
  failedLoginAttempts: number = 0
  lockUntil: Date | null
  // createdAt: Date
  updatedAt: Date
  // deletedAt: Date | null
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
    this.updatedAt = partial.updatedAt || new Date()
    this.failedLoginAttempts = partial.failedLoginAttempts ?? 0
    this.lockUntil = partial.lockUntil ?? undefined
    // this.classIds = partial.classIds ?? undefined;
    // this.classId = partial.classId ?? undefined;
    // this.childrenIds = partial.childrenIds ?? undefined;
  }
}
