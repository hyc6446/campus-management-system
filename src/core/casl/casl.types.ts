import { MongoAbility } from '@casl/ability';

/**
 * 系统操作类型枚举
 * 定义用户可以对资源执行的所有操作类型
 */
export enum Action {
  Manage = 'manage', // 管理权限（最高权限，包含所有操作）
  Create = 'create', // 创建资源权限
  Read = 'read',     // 读取资源权限
  Update = 'update', // 更新资源权限
  Delete = 'delete', // 删除资源权限
}
/**
 * 系统资源类型枚举
 * 定义系统中所有可被授权访问的资源类型
 * 与Subjects类型保持一致，提供运行时可用的枚举值
 */
export enum SubjectsEnum {
  All = 'all',
  User = 'User',
  Profile = 'Profile',
  Class = 'Class',
  Course = 'Course',
  Score = 'Score',
  Attendance = 'Attendance',
  AuditLog = 'AuditLog'
}
/**
 * 系统资源类型定义
 * 列出系统中所有可被授权访问的资源类型
 */
export type Subjects = SubjectsEnum.All | SubjectsEnum.User | SubjectsEnum.Profile | SubjectsEnum.Class | 
  SubjectsEnum.Course | SubjectsEnum.Score | SubjectsEnum.Attendance | SubjectsEnum.AuditLog
/**
 * 应用程序能力类型
 * 定义了CASL能力对象的具体类型，结合了操作类型和资源类型
 */
export type AppAbility = MongoAbility<[Action, Subjects]>