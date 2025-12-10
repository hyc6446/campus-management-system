
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


/**
 * 查询配置组合器 - 用于灵活组合select和include配置
 * @param configs 多个查询配置对象
 * @returns 组合后的查询配置
 */
export function combinePrismaConfigs<
  Select extends Record<string, boolean>,
  Include extends Record<string, any>
>(
  ...configs: Array<{ select?: Partial<Select>; include?: Partial<Include> }>
): { select: Select; include: Include } {
  // 合并select配置
  const combinedSelect = configs
    .filter(config => config.select)
    .reduce((acc, config) => ({ ...acc, ...config.select }), {} as Select);

  // 合并include配置
  const combinedInclude = configs
    .filter(config => config.include)
    .reduce((acc, config) => ({ ...acc, ...config.include }), {} as Include);

  return { select: combinedSelect, include: combinedInclude };
}

/**
 * 递归合并include配置 - 支持深层嵌套的include组合
 * @param includeConfigs 多个include配置
 * @returns 合并后的include配置
 */
export function deepCombineIncludes<Include extends Record<string, any>>(
  ...includeConfigs: Array<Partial<Include>>
): Include {
  // 使用 Record<string, any> 作为中间类型，允许安全写入
  return includeConfigs.reduce((acc, include) => {
    if (!include) return acc;
    
    // 使用中间类型 Record<string, any> 进行安全的写入操作
    const newInclude: Record<string, any> = { ...acc };
    
    // 遍历 include 配置，安全合并
    for (const [key, value] of Object.entries(include)) {
      const currentValue = acc[key];
      const nextValue = value;
      
      // 递归合并嵌套 include
      if (currentValue && nextValue && typeof currentValue === 'object' && typeof nextValue === 'object') {
        newInclude[key] = {
          ...currentValue,
          ...nextValue,
          // 递归合并嵌套的 include
          include: deepCombineIncludes(
            (currentValue as any).include as Record<string, any>, 
            (nextValue as any).include as Record<string, any>
          )
        };
      } else {
        newInclude[key] = nextValue;
      }
    }
    
    // 最后将结果断言为泛型类型 Include
    return newInclude as Include;
  }, {} as Record<string, any>) as Include;
}

// // 示例1：组合基本用户信息和角色信息
// const userWithRoleConfig = combinePrismaConfigs(
//   { select: DEFAULT_USER },
//   { include: WITH_ROLE }
// );
// const user = await userService.getUserInfo(1, userWithRoleConfig);

// // 示例2：深层嵌套组合 - 用户+角色+权限
// const userWithRolePermissionsConfig = combinePrismaConfigs(
//   { select: SAFE_USER },
//   { include: deepCombineIncludes(WITH_ROLE, WITH_PERMISSIONS) }
// );
// const userWithPermissions = await userService.getUserInfo(1, userWithRolePermissionsConfig);

// // 示例3：动态组合 - 根据业务条件
// const baseConfig = { select: SAFE_USER };
// const includeConfig = isAdmin ? { include: deepCombineIncludes(WITH_ROLE, WITH_PERMISSIONS) } : { include: WITH_ROLE };
// const dynamicConfig = combinePrismaConfigs(baseConfig, includeConfig);
// const dynamicUser = await userService.getUserInfo(1, dynamicConfig);