/**
 * 通用工具：根据字段列表生成Select配置
 * @param fields 要包含的字段列表
 * @returns Prisma Select配置对象
 */
// export function generateSelect<T extends string>(fields: T[]): { [K in T]: true } {
//   const select = {} as { [K in T]: true };
//   fields.forEach(field => {
//     select[field] = true;
//   });
//   return select;
// }

/**
 * 通用工具：排除指定字段生成Select配置
 * @param allFields 所有可用字段列表
 * @param excludeFields 要排除的字段列表
 * @returns Prisma Select配置对象
 */
// export function generateSelectExcept<T extends string>(allFields: T[], excludeFields: T[]): { [K in Exclude<T, typeof excludeFields[number]>]: true } {
//   const fieldsToInclude = allFields.filter(field => !excludeFields.includes(field));
//   return generateSelect(fieldsToInclude) as { [K in Exclude<T, typeof excludeFields[number]>]: true };
// }

/**
 * 通用工具：生成包含所有字段的Select配置
 * @param allFields 所有可用字段列表
 * @returns Prisma Select配置对象
 */
export function generateFullSelect<T extends string>(allFields: T[]): { [K in string]: true } {
  return generateSelect(allFields)
}
/**
 * 生成 select 对象（仅包含指定字段）
 * @param allFields 表的完整字段列表（用于类型约束）
 * @param includeFields 要包含的字段（必须是 allFields 的子集）
 * @returns { [field: string]: true }，且类型兼容 Prisma.Select
 */
export function generateSelect<
  TAllFields extends readonly string[],
  TInclude extends readonly string[]
>(
  allFields: TAllFields,
  includeFields?: TInclude &
    (TInclude extends unknown[]
      ? { [K in keyof TInclude]: TInclude[K] extends TAllFields[number] ? TInclude[K] : never }
      : never)
): { [K in TInclude[number]]: true } {
  const result = {} as { [K in TInclude[number]]: true }
  const fields = includeFields ? includeFields : allFields
  for (const field of fields) {
    // 运行时可加校验（可选）
    if (!allFields.includes(field as any)) {
      throw new Error(`Invalid field: ${field}`)
    }
    result[field] = true
  }
  return result
}

/**
 * 生成 select 对象（排除指定字段）
 * @param allFields 表的完整字段列表
 * @param excludeFields 要排除的字段
 * @returns 包含 allFields 中未被排除字段的 select 对象
 */
export function generateSelectExcept<
  TAllFields extends readonly string[],
  TExclude extends readonly string[]
>(
  allFields: TAllFields,
  excludeFields: TExclude &
    (TExclude extends unknown[]
      ? { [K in keyof TExclude]: TExclude[K] extends TAllFields[number] ? TExclude[K] : never }
      : never)
): { [K in Exclude<TAllFields[number], TExclude[number]>]: true } {
  const includeFields = allFields.filter(field => !excludeFields.includes(field as any)) as Exclude<
    TAllFields[number],
    TExclude[number]
  >[]
  return generateSelect(allFields, includeFields)
}
