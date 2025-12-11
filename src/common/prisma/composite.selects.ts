// src/selects/composite.selects.ts

import type { Prisma } from '@prisma/client'

import { DEFAULT_USER_FIELDS,DEFAULT_SAFE_USER_FIELDS, DEFAULT_USER_FULL_FIELDS} from './select/user-fields'
import {DEFAULT_ROLE_FIELDS,DEFAULT_SAFE_ROLE_FIELDS,DEFAULT_ROLE_FULL_FIELDS} from './select/role-fields';

// ==============================
// User
// ==============================
export const DEFAULT_USER_SELECT = {
  select: {
    ...DEFAULT_USER_FIELDS,
  },
} satisfies Prisma.UserFindFirstArgs
export const DEFAULT_SAFE_USER_SELECT = {
  select: {
    ...DEFAULT_SAFE_USER_FIELDS,
  },
} satisfies Prisma.UserFindFirstArgs

export const DEFAULT_USER_FULL_SELECT = {
  select: {
    ...DEFAULT_USER_FULL_FIELDS,
  },
} satisfies Prisma.UserFindFirstArgs
// ==============================
// Role
// ==============================
export const DEFAULT_ROLE_SELECT = {
  select: {
    ...DEFAULT_ROLE_FIELDS,
  },
} satisfies Prisma.RoleFindFirstArgs
export const DEFAULT_SAFE_ROLE_SELECT = {
    select: {
        ...DEFAULT_SAFE_ROLE_FIELDS,
    },
} satisfies Prisma.RoleFindFirstArgs
export const DEFAULT_ROLE_FULL_SELECT = {
  select: {
    ...DEFAULT_ROLE_FULL_FIELDS,
  },
} satisfies Prisma.RoleFindFirstArgs

// ==============================
// User with Role
// ==============================
export const DEFAULT_USER_WITH_ROLE = {
  select: {
    ...DEFAULT_USER_FIELDS,
    role: {
      select: DEFAULT_ROLE_FIELDS,
    },
  },
} satisfies Partial<Prisma.UserFindUniqueArgs>

export const DEFAULT_SAFE_USER_WITH_ROLE = {
  select: {
    ...DEFAULT_SAFE_USER_FIELDS,
    role: {
      select: DEFAULT_SAFE_ROLE_FIELDS,
    },
  },
} satisfies Prisma.UserFindFirstArgs

export const DEFAULT_USER_AND_ROLE_FULL = {
  select: {
    ...DEFAULT_USER_FULL_FIELDS,
    role: true, // 或者用 DEFAULT_ROLE_FULL_FIELDS
  },
} satisfies Prisma.UserFindFirstArgs

// ==============================
// Role with Users
// ==============================

export const DEFAULT_ROLE_WITH_USERS = {
  select: {
    ...DEFAULT_ROLE_FIELDS,
    users: {
      select: DEFAULT_USER_FIELDS,
    },
  },
} satisfies Prisma.RoleFindFirstArgs

export const DEFAULT_SAFE_ROLE_WITH_USERS = {
  select: {
    ...DEFAULT_SAFE_ROLE_FIELDS,
    users: {
      select: DEFAULT_SAFE_USER_FIELDS,
    },
  },
} satisfies Prisma.RoleFindFirstArgs

export const DEFAULT_ROLE_AND_USERS_FULL = {
  select: {
    ...DEFAULT_ROLE_FULL_FIELDS,
    users: true,
  },
} satisfies Prisma.RoleFindFirstArgs
