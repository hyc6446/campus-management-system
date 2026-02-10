import type {
  User,
  Role,
  Book,
  Token,
  Class,
  Borrow,
  Course,
  Student,
  Permission,
  RuleConfig,
  LibrarySeat,
  SystemNotice,
  CourseTeaching,
  BookReservation,
  SeatReservation,
  CourseEnrollment,
} from '@prisma/client'

import * as UserFields from './user-fields'
import * as RoleFields from './role-fields'
import * as BookFields from './book-fields'
import * as TokenFields from './token-fields'
import * as ClassFields from './class-fields'
import * as BorrowFields from './borrow-fields'
import * as CourseFields from './course-fields'
import * as StudentFields from './student-fields'
import * as PermissionFields from './permission-fields'
import * as RuleConfigFields from './ruleConfig-fields'
import * as LibrarySeatFields from './librarySeat-fields'
import * as SystemNoticeFields from './systemNotice-fields'
import * as CourseTeachingFields from './courseTeaching-fields'
import * as BookReservationFields from './bookReservation-fields'
import * as SeatReservationFields from './seatReservation-fields'
import * as CourseEnrollmentFields from './courseEnrollment-fields'

// 使用单独的重新导出语句
export * from './user-fields'
export * from './role-fields'
export * from './book-fields'
export * from './token-fields'
export * from './class-fields'
export * from './borrow-fields'
export * from './course-fields'
export * from './student-fields'
export * from './permission-fields'
export * from './ruleConfig-fields'
export * from './librarySeat-fields'
export * from './systemNotice-fields'
export * from './courseTeaching-fields'
export * from './bookReservation-fields'
export * from './seatReservation-fields'
export * from './courseEnrollment-fields'

// 定义================ 基本用户 ===========类型
export type DEFAULT_USER_TYPE = { [K in keyof typeof UserFields.DEFAULT_USER_FIELDS]: User[K] }
export type SAFE_USER_TYPE = { [K in keyof typeof UserFields.SAFE_USER_FIELDS]: User[K] }
export type FULL_USER_TYPE = { [K in keyof typeof UserFields.FULL_USER_FIELDS]: User[K] }
export type ALLOWED_USER_FILTER_TYPE = (typeof UserFields.USER_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_USER_SORT_TYPE = (typeof UserFields.USER_ALLOWED_SORT_FIELDS)[number]

// 定义================ 基本角色 ===========类型
export type DEFAULT_ROLE_TYPE = { [K in keyof typeof RoleFields.DEFAULT_ROLE_FIELDS]: Role[K] }
export type SAFE_ROLE_TYPE = { [K in keyof typeof RoleFields.SAFE_ROLE_FIELDS]: Role[K] }
export type FULL_ROLE_TYPE = { [K in keyof typeof RoleFields.FULL_ROLE_FIELDS]: Role[K] }
export type ALLOWED_ROLE_FILTER_TYPE = (typeof RoleFields.ROLE_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_ROLE_SORT_TYPE = (typeof RoleFields.ROLE_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本图书 ===========类型
export type DEFAULT_BOOK_TYPE = { [K in keyof typeof BookFields.DEFAULT_BOOK_FIELDS]: Book[K] }
export type SAFE_BOOK_TYPE = { [K in keyof typeof BookFields.SAFE_BOOK_FIELDS]: Book[K] }
export type FULL_BOOK_TYPE = { [K in keyof typeof BookFields.FULL_BOOK_FIELDS]: Book[K] }
export type ALLOWED_BOOK_FILTER_TYPE = (typeof BookFields.BOOK_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_BOOK_SORT_TYPE = (typeof BookFields.BOOK_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本令牌 ===========类型
export type DEFAULT_TOKEN_TYPE = { [K in keyof typeof TokenFields.DEFAULT_TOKEN_FIELDS]: Token[K] }
export type SAFE_TOKEN_TYPE = { [K in keyof typeof TokenFields.SAFE_TOKEN_FIELDS]: Token[K] }
export type FULL_TOKEN_TYPE = { [K in keyof typeof TokenFields.FULL_TOKEN_FIELDS]: Token[K] }
export type ALLOWED_TOKEN_FILTER_TYPE = (typeof TokenFields.TOKEN_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_TOKEN_SORT_TYPE = (typeof TokenFields.TOKEN_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本班级 ===========类型
export type DEFAULT_CLASS_TYPE = { [K in keyof typeof ClassFields.DEFAULT_CLASS_FIELDS]: Class[K] }
export type SAFE_CLASS_TYPE = { [K in keyof typeof ClassFields.SAFE_CLASS_FIELDS]: Class[K] }
export type FULL_CLASS_TYPE = { [K in keyof typeof ClassFields.FULL_CLASS_FIELDS]: Class[K] }
export type ALLOWED_CLASS_FILTER_TYPE = (typeof ClassFields.CLASS_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_CLASS_SORT_TYPE = (typeof ClassFields.CLASS_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本图书借阅 ===========类型
export type DEFAULT_BORROW_TYPE = {
  [K in keyof typeof BorrowFields.DEFAULT_BORROW_FIELDS]: Borrow[K]
}
export type SAFE_BORROW_TYPE = { [K in keyof typeof BorrowFields.SAFE_BORROW_FIELDS]: Borrow[K] }
export type FULL_BORROW_TYPE = { [K in keyof typeof BorrowFields.FULL_BORROW_FIELDS]: Borrow[K] }
export type ALLOWED_BORROW_FILTER_TYPE = (typeof BorrowFields.BORROW_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_BORROW_SORT_TYPE = (typeof BorrowFields.BORROW_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本课程 ===========类型
export type DEFAULT_COURSE_TYPE = {
  [K in keyof typeof CourseFields.DEFAULT_COURSE_FIELDS]: Course[K]
}
export type SAFE_COURSE_TYPE = { [K in keyof typeof CourseFields.SAFE_COURSE_FIELDS]: Course[K] }
export type FULL_COURSE_TYPE = { [K in keyof typeof CourseFields.FULL_COURSE_FIELDS]: Course[K] }
export type ALLOWED_COURSE_FILTER_TYPE = (typeof CourseFields.COURSE_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_COURSE_SORT_TYPE = (typeof CourseFields.COURSE_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本学生 ===========类型
export type DEFAULT_STUDENT_TYPE = {
  [K in keyof typeof StudentFields.DEFAULT_STUDENT_FIELDS]: Student[K]
}
export type SAFE_STUDENT_TYPE = {
  [K in keyof typeof StudentFields.SAFE_STUDENT_FIELDS]: Student[K]
}
export type FULL_STUDENT_TYPE = {
  [K in keyof typeof StudentFields.FULL_STUDENT_FIELDS]: Student[K]
}
export type ALLOWED_STUDENT_FILTER_TYPE =
  (typeof StudentFields.STUDENT_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_STUDENT_SORT_TYPE = (typeof StudentFields.STUDENT_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本权限 ===========类型
export type DEFAULT_PERMISSION_TYPE = {
  [K in keyof typeof PermissionFields.DEFAULT_PERMISSION_FIELDS]: Permission[K]
}
export type SAFE_PERMISSION_TYPE = {
  [K in keyof typeof PermissionFields.SAFE_PERMISSION_FIELDS]: Permission[K]
}
export type FULL_PERMISSION_TYPE = {
  [K in keyof typeof PermissionFields.FULL_PERMISSION_FIELDS]: Permission[K]
}
export type ALLOWED_PERMISSION_FILTER_TYPE =
  (typeof PermissionFields.PERMISSION_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_PERMISSION_SORT_TYPE =
  (typeof PermissionFields.PERMISSION_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本规则配置 ===========类型
export type DEFAULT_RULE_CONFIG_TYPE = {
  [K in keyof typeof RuleConfigFields.DEFAULT_RULE_CONFIG_FIELDS]: RuleConfig[K]
}
export type SAFE_RULE_CONFIG_TYPE = {
  [K in keyof typeof RuleConfigFields.SAFE_RULE_CONFIG_FIELDS]: RuleConfig[K]
}
export type FULL_RULE_CONFIG_TYPE = {
  [K in keyof typeof RuleConfigFields.FULL_RULE_CONFIG_FIELDS]: RuleConfig[K]
}
export type ALLOWED_RULE_CONFIG_FILTER_TYPE =
  (typeof RuleConfigFields.RULE_CONFIG_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_RULE_CONFIG_SORT_TYPE =
  (typeof RuleConfigFields.RULE_CONFIG_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本图书馆座位 ===========类型
export type DEFAULT_LIBRARY_SEAT_TYPE = {
  [K in keyof typeof LibrarySeatFields.DEFAULT_LIBRARY_SEAT_FIELDS]: LibrarySeat[K]
}
export type SAFE_LIBRARY_SEAT_TYPE = {
  [K in keyof typeof LibrarySeatFields.SAFE_LIBRARY_SEAT_FIELDS]: LibrarySeat[K]
}
export type FULL_LIBRARY_SEAT_TYPE = {
  [K in keyof typeof LibrarySeatFields.FULL_LIBRARY_SEAT_FIELDS]: LibrarySeat[K]
}
export type ALLOWED_LIBRARY_SEAT_FILTER_TYPE =
  (typeof LibrarySeatFields.LIBRARY_SEAT_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_LIBRARY_SEAT_SORT_TYPE =
  (typeof LibrarySeatFields.LIBRARY_SEAT_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本系统公告 ===========类型
export type DEFAULT_NOTICE_TYPE = {
  [K in keyof typeof SystemNoticeFields.DEFAULT_SYSTEM_NOTICE_FIELDS]: SystemNotice[K]
}
export type SAFE_NOTICE_TYPE = {
  [K in keyof typeof SystemNoticeFields.SAFE_SYSTEM_NOTICE_FIELDS]: SystemNotice[K]
}
export type FULL_NOTICE_TYPE = {
  [K in keyof typeof SystemNoticeFields.FULL_SYSTEM_NOTICE_FIELDS]: SystemNotice[K]
}
export type ALLOWED_NOTICE_FILTER_TYPE =
  (typeof SystemNoticeFields.SYSTEM_NOTICE_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_NOTICE_SORT_TYPE =
  (typeof SystemNoticeFields.SYSTEM_NOTICE_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本课程登记表 ===========类型
export type DEFAULT_COURSE_TEACHING_TYPE = {
  [K in keyof typeof CourseTeachingFields.DEFAULT_COURSE_TEACHING_FIELDS]: CourseTeaching[K]
}
export type SAFE_COURSE_TEACHING_TYPE = {
  [K in keyof typeof CourseTeachingFields.SAFE_COURSE_TEACHING_FIELDS]: CourseTeaching[K]
}
export type FULL_COURSE_TEACHING_TYPE = {
  [K in keyof typeof CourseTeachingFields.FULL_COURSE_TEACHING_FIELDS]: CourseTeaching[K]
}
export type ALLOWED_COURSE_TEACHING_FILTER_TYPE =
  (typeof CourseTeachingFields.COURSE_TEACHING_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_COURSE_TEACHING_SORT_TYPE =
  (typeof CourseTeachingFields.COURSE_TEACHING_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本图书预约 ===========类型
export type DEFAULT_BOOK_RESERVATION_TYPE = {
  [K in keyof typeof BookReservationFields.DEFAULT_BOOK_RESERVATION_FIELDS]: BookReservation[K]
}
export type SAFE_BOOK_RESERVATION_TYPE = {
  [K in keyof typeof BookReservationFields.SAFE_BOOK_RESERVATION_FIELDS]: BookReservation[K]
}
export type FULL_BOOK_RESERVATION_TYPE = {
  [K in keyof typeof BookReservationFields.FULL_BOOK_RESERVATION_FIELDS]: BookReservation[K]
}
export type ALLOWED_BOOK_RESERVATION_FILTER_TYPE =
  (typeof BookReservationFields.BOOK_RESERVATION_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_BOOK_RESERVATION_SORT_TYPE =
  (typeof BookReservationFields.BOOK_RESERVATION_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本图书馆预定 ===========类型
export type DEFAULT_SEAT_RESERVATION_TYPE = {
  [K in keyof typeof SeatReservationFields.DEFAULT_SEAT_RESERVATION_FIELDS]: SeatReservation[K]
}
export type SAFE_SEAT_RESERVATION_TYPE = {
  [K in keyof typeof SeatReservationFields.SAFE_SEAT_RESERVATION_FIELDS]: SeatReservation[K]
}
export type FULL_SEAT_RESERVATION_TYPE = {
  [K in keyof typeof SeatReservationFields.FULL_SEAT_RESERVATION_FIELDS]: SeatReservation[K]
}
export type ALLOWED_SEAT_RESERVATION_FILTER_TYPE =
  (typeof SeatReservationFields.SEAT_RESERVATION_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_SEAT_RESERVATION_SORT_TYPE =
  (typeof SeatReservationFields.SEAT_RESERVATION_ALLOWED_SORT_FIELDS)[number]
// 定义================ 基本课程预约 ===========类型
export type DEFAULT_COURSE_ENROLLMENT_TYPE = {
  [K in keyof typeof CourseEnrollmentFields.DEFAULT_COURSE_ENROLLMENT_FIELDS]: CourseEnrollment[K]
}
export type SAFE_COURSE_ENROLLMENT_TYPE = {
  [K in keyof typeof CourseEnrollmentFields.SAFE_COURSE_ENROLLMENT_FIELDS]: CourseEnrollment[K]
}
export type FULL_COURSE_ENROLLMENT_TYPE = {
  [K in keyof typeof CourseEnrollmentFields.FULL_COURSE_ENROLLMENT_FIELDS]: CourseEnrollment[K]
}
export type ALLOWED_COURSE_ENROLLMENT_FILTER_TYPE =
  (typeof CourseEnrollmentFields.COURSE_ENROLLMENT_ALLOWED_FILTER_FIELDS)[number]
export type ALLOWED_COURSE_ENROLLMENT_SORT_TYPE =
  (typeof CourseEnrollmentFields.COURSE_ENROLLMENT_ALLOWED_SORT_FIELDS)[number]

// 定义================ 混合字段数据 ===========类型
// 用户默认-角色默认 类型
export type USER_ROLE_DEFAULT_TYPE = DEFAULT_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户默认-角色安全 类型
export type USER_DEFAULT_ROLE_SAFE_TYPE = DEFAULT_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户默认-角色完整 类型
export type USER_DEFAULT_ROLE_FULL_TYPE = DEFAULT_USER_TYPE & { role: FULL_ROLE_TYPE }
// 用户安全-角色默认 类型
export type USER_SAFE_ROLE_DEFAULT_TYPE = SAFE_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户安全-角色安全 类型
export type USER_ROLE_SAFE_TYPE = SAFE_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户安全-角色完整 类型
export type USER_SAFE_ROLE_FULL_TYPE = SAFE_USER_TYPE & { role: FULL_ROLE_TYPE }
// 用户完整-角色默认 类型
export type USER_FULL_ROLE_DEFAULT_TYPE = FULL_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户完整-角色安全 类型
export type USER_FULL_ROLE_SAFE_TYPE = FULL_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户完整-角色完整 类型
export type USER_ROLE_FULL_TYPE = FULL_USER_TYPE & { role: FULL_ROLE_TYPE }

// 角色默认-权限默认 类型
export type ROLE_DEFAULT_PERMISSION_DEFAULT_TYPE = DEFAULT_ROLE_TYPE & {
  permission: DEFAULT_PERMISSION_TYPE
}
// 角色安全-权限默认 类型
export type ROLE_SAFE_PERMISSION_DEFAULT_TYPE = SAFE_ROLE_TYPE & {
  permission: DEFAULT_PERMISSION_TYPE
}
// 角色完整-权限默认 类型
export type ROLE_FULL_PERMISSION_DEFAULT_TYPE = FULL_ROLE_TYPE & {
  permission: DEFAULT_PERMISSION_TYPE
}
// 角色默认-权限安全 类型
export type ROLE_DEFAULT_PERMISSION_SAFE_TYPE = DEFAULT_ROLE_TYPE & {
  permission: SAFE_PERMISSION_TYPE
}
// 角色安全-权限安全 类型
export type ROLE_SAFE_PERMISSION_SAFE_TYPE = SAFE_ROLE_TYPE & { permission: SAFE_PERMISSION_TYPE }
// 角色完整-权限安全 类型
export type ROLE_FULL_PERMISSION_SAFE_TYPE = FULL_ROLE_TYPE & { permission: SAFE_PERMISSION_TYPE }
// 角色默认-权限完整 类型
export type ROLE_DEFAULT_PERMISSION_FULL_TYPE = DEFAULT_ROLE_TYPE & {
  permission: FULL_PERMISSION_TYPE
}
// 角色安全-权限完整 类型
export type ROLE_SAFE_PERMISSION_FULL_TYPE = SAFE_ROLE_TYPE & { permission: FULL_PERMISSION_TYPE }
// 角色完整-权限完整 类型
export type ROLE_FULL_PERMISSION_FULL_TYPE = FULL_ROLE_TYPE & { permission: FULL_PERMISSION_TYPE }



// 列表接口类型
export type QUERY_LIST_TYPE<T> = {
  data: T[]
  total: number
  page: number
  take: number
}
