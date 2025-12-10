import { Prisma } from "@prisma/client";

/**
 * 通用工具：根据字段列表生成Select配置
 * @param fields 要包含的字段列表
 * @returns Prisma Select配置对象
 */
export function generateSelect<T extends string>(fields: T[]): { [K in T]: true } {
  const select = {} as { [K in T]: true };
  fields.forEach(field => {
    select[field] = true;
  });
  return select;
}

/**
 * 通用工具：排除指定字段生成Select配置
 * @param allFields 所有可用字段列表
 * @param excludeFields 要排除的字段列表
 * @returns Prisma Select配置对象
 */
export function generateSelectExcept<T extends string>(allFields: T[], excludeFields: T[]): { [K in Exclude<T, typeof excludeFields[number]>]: true } {
  const fieldsToInclude = allFields.filter(field => !excludeFields.includes(field));
  return generateSelect(fieldsToInclude) as { [K in Exclude<T, typeof excludeFields[number]>]: true };
}

/**
 * 通用工具：生成包含所有字段的Select配置
 * @param allFields 所有可用字段列表
 * @returns Prisma Select配置对象
 */
export function generateFullSelect<T extends string>(allFields: T[]): { [K in T]: true } {
  return generateSelect(allFields);
}