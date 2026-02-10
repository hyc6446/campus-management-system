import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const SEAT_RESERVATION_TABLE_FIELDS = [
  'id',
  'seatId',
  'userId',
  'status',
  'reserveDate',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 SeatReservation 自身字段）
export const DEFAULT_SEAT_RESERVATION_FIELDS = {
  id: true,
  seatId: true,
  userId: true,
  status: true,
  reserveDate: true,
  startTime: true,
  endTime: true,
  createdAt: true,
} satisfies Prisma.SeatReservationSelect    

export const SAFE_SEAT_RESERVATION_FIELDS = {
  ...DEFAULT_SEAT_RESERVATION_FIELDS,
  updatedAt: true,
} satisfies Prisma.SeatReservationSelect

export const FULL_SEAT_RESERVATION_FIELDS = {
  ...SAFE_SEAT_RESERVATION_FIELDS,  
  deletedAt: true,
} satisfies Prisma.SeatReservationSelect

// 允许的查询筛选字段
export const SEAT_RESERVATION_ALLOWED_FILTER_FIELDS = [
  'id',
  'seatId',
  'userId',
  'status',
  'createdAt',
] as const
// 允许的排序字段
export const SEAT_RESERVATION_ALLOWED_SORT_FIELDS = ['id', 'createdAt']
