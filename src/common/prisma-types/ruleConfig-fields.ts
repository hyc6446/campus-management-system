import type { Prisma } from '@prisma/client';

// 字段列表（用于工具函数，可选）
 const RULE_CONFIG_TABLE_FIELDS = [
  'id',
  'rule',
  'type',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

// 预设字段对象（只包含 RuleConfig 自身字段，不包含其他关联）
 const DEFAULT_RULE_CONFIG_FIELDS = {
  id: true,
  rule: true,
  type: true,
  createdAt: true,
} satisfies Prisma.RuleConfigSelect;

 const SAFE_RULE_CONFIG_FIELDS = {
  ...DEFAULT_RULE_CONFIG_FIELDS,
  updatedAt: true,
} satisfies Prisma.RuleConfigSelect;

 const FULL_RULE_CONFIG_FIELDS = {
  ...SAFE_RULE_CONFIG_FIELDS,
  deletedAt: true,
} satisfies Prisma.RuleConfigSelect;

// 允许的查询筛选字段
const RULE_CONFIG_ALLOWED_FILTER_FIELDS = [ "id", "rule", "type", "createdAt", "deletedAt" ] as const;
// 允许的排序字段
const RULE_CONFIG_ALLOWED_SORT_FIELDS = [ "id", "createdAt" ];

export {
  RULE_CONFIG_TABLE_FIELDS, 
  DEFAULT_RULE_CONFIG_FIELDS,
  SAFE_RULE_CONFIG_FIELDS,
  FULL_RULE_CONFIG_FIELDS,
  RULE_CONFIG_ALLOWED_FILTER_FIELDS,
  RULE_CONFIG_ALLOWED_SORT_FIELDS,
}