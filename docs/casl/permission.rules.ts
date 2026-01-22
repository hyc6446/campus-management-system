// // src/core/casl/permission.rules.ts
// import { Action, SubjectsEnum } from './casl.types';

// // 角色定义
// export enum Role {
//   ADMIN = 'ADMIN',
//   TEACHER = 'TEACHER',
//   STUDENT = 'STUDENT',
//   PARENT = 'PARENT'
// }

// // 权限规则接口
// export interface PermissionRule {
//   role: Role;
//   action: Action;
//   subject: SubjectsEnum;
//   conditions?: any;
//   fields?: string[];
//   inverted?: boolean;
// }

// // 硬编码权限规则列表
// export const permissionRules: PermissionRule[] = [
//   // ==================== 管理员权限 ====================
//   {
//     role: Role.ADMIN,
//     action: Action.Manage,
//     subject: SubjectsEnum.All
//   },

//   // ==================== 教师权限 ====================
//   // 教师管理自己的资料
//   {
//     role: Role.TEACHER,
//     action: Action.Manage,
//     subject: SubjectsEnum.Profile,
//     conditions: { userId: '$currentUserId' }
//   },
//   // 教师管理自己的课程
//   {
//     role: Role.TEACHER,
//     action: Action.Manage,
//     subject: SubjectsEnum.Course,
//     conditions: { teacherId: '$currentUserId' }
//   },
//   // 教师查看和管理所教班级的学生
//   {
//     role: Role.TEACHER,
//     action: Action.Read,
//     subject: SubjectsEnum.User,
//     conditions: { classId: { $in: '$teacherClassIds' } }
//   },
//   // 教师管理学生成绩
//   {
//     role: Role.TEACHER,
//     action: Action.Manage,
//     subject: SubjectsEnum.Score,
//     conditions: { courseId: { $in: '$teacherCourseIds' } }
//   },
//   // 教师管理学生考勤
//   {
//     role: Role.TEACHER,
//     action: Action.Manage,
//     subject: SubjectsEnum.Attendance,
//     conditions: { courseId: { $in: '$teacherCourseIds' } }
//   },
//   // 教师查看审计日志（仅与自己相关）
//   {
//     role: Role.TEACHER,
//     action: Action.Read,
//     subject: SubjectsEnum.AuditLog,
//     conditions: { userId: '$currentUserId' }
//   },

//   // ==================== 学生权限 ====================
//   // 学生管理自己的资料
//   {
//     role: Role.STUDENT,
//     action: Action.Update,
//     subject: SubjectsEnum.Profile,
//     conditions: { userId: '$currentUserId' }
//   },
//   // 学生查看自己的资料
//   {
//     role: Role.STUDENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Profile,
//     conditions: { userId: '$currentUserId' }
//   },
//   // 学生查看自己的成绩
//   {
//     role: Role.STUDENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Score,
//     conditions: { studentId: '$currentUserId' }
//   },
//   // 学生查看自己的考勤
//   {
//     role: Role.STUDENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Attendance,
//     conditions: { studentId: '$currentUserId' }
//   },
//   // 学生查看自己的课程
//   {
//     role: Role.STUDENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Course,
//     conditions: { classId: '$studentClassId' }
//   },

//   // ==================== 家长权限 ====================
//   // 家长查看关联学生的资料
//   {
//     role: Role.PARENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Profile,
//     conditions: { userId: { $in: '$childUserIds' } }
//   },
//   // 家长查看关联学生的成绩
//   {
//     role: Role.PARENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Score,
//     conditions: { studentId: { $in: '$childUserIds' } }
//   },
//   // 家长查看关联学生的考勤
//   {
//     role: Role.PARENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Attendance,
//     conditions: { studentId: { $in: '$childUserIds' } }
//   },
//   // 家长查看关联学生的课程
//   {
//     role: Role.PARENT,
//     action: Action.Read,
//     subject: SubjectsEnum.Course,
//     conditions: { classId: { $in: '$childClassIds' } }
//   }
// ];