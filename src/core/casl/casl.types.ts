import { MongoAbility } from '@casl/ability';

/**
 * 系统操作类型枚举
 * 定义用户可以对资源执行的所有操作类型
 */
export enum Action {
  Manage = 'Manage', // 管理权限（最高权限，包含所有操作）
  Create = 'create', // 创建资源权限
  Read = 'read',     // 读取资源权限
  Update = 'update', // 更新资源权限
  Delete = 'delete', // 删除资源权限
  Restore = 'restore', // 恢复资源权限
}
/**
 * 系统资源类型枚举
 * 定义系统中所有可被授权访问的资源类型
 * 与Subjects类型保持一致，提供运行时可用的枚举值
 */
export enum SubjectsEnum {
  All = 'All',
  User = 'User',
  Role = 'Role',
  Book = 'Book',
  Score = 'Score',
  Class = 'Class',
  Token = 'Token',
  Course = 'Course',
  Notice = 'Notice',
  Borrow = 'Borrow',
  Student = 'Student',
  AuditLog = 'AuditLog',
  RuleConfig = 'RuleConfig',
  Attendance = 'Attendance',
  Permission = 'Permission',
  LibrarySeat = 'LibrarySeat',
  BookReservation = 'BookReservation',
  SeatReservation = 'SeatReservation',
  CourseEnrollment = 'CourseEnrollment',
}
/**
 * 系统资源类型定义
 * 自动从SubjectsEnum生成，确保与枚举保持一致
 */
export type Subjects = typeof SubjectsEnum[keyof typeof SubjectsEnum]
/**
 * 应用程序能力类型
 * 定义了CASL能力对象的具体类型，结合了操作类型和资源类型
 */
export type AppAbility = MongoAbility<[Action, Subjects]>