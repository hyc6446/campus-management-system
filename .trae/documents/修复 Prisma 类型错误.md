## 问题分析

错误信息：`"D:/Node/campus-management-system/node_modules/.pnpm/@prisma+client@6.19.0_prisma@6.19.0_typescript@5.9.3/node_modules/.prisma/client/index".Prisma` 没有导出的成员 `RuleWhereInput`。你是否指的是 `RoleWhereInput`?ts(2724)

### 根本原因

1. **模型名称不匹配**：在 Prisma schema 文件中，规则配置的模型名称是 `RuleConfig`（第 165 行），而不是 `Rule`
2. **类型名称错误**：Prisma 客户端会根据模型名称生成对应的类型，因此正确的类型应该是 `RuleConfigWhereInput`，而不是 `RuleWhereInput`
3. **混淆了不同模型**：错误信息中提到的 `RoleWhereInput` 是来自 `Role` 模型的正确类型

### 修复方案

将 `rule-config.service.ts` 文件第 21 行的 `Prisma.RuleWhereInput` 改为 `Prisma.RuleConfigWhereInput`

### 修复代码

```typescript
// 原代码（错误）
const where: Prisma.RuleWhereInput = { deletedAt: null }

// 修复后代码
const where: Prisma.RuleConfigWhereInput = { deletedAt: null }
```

### 验证步骤

1. 修复代码后，TypeScript 错误应该会消失
2. 运行 `npm run build` 或 `npx tsc` 验证编译通过
3. 运行项目测试确保功能正常

### 类似问题检查

建议检查项目中其他使用 Prisma 类型的地方，确保模型名称与生成的类型名称一致，避免类似错误。