# nbook - 实体模式重构示例

## 概述

`nbook` 目录展示了如何使用实体模式重构图书模块。相比原有的 `book` 模块，`nbook` 采用了领域驱动设计（DDD）的思想，将业务逻辑封装在实体类中。

## 目录结构

```
nbook/
├── entities/              # 实体类定义
│   ├── index.ts          # 实体导出
│   ├── base.entity.ts    # 基础实体类
│   ├── book.entity.ts    # 图书实体类
│   ├── book-fields.ts    # 字段定义（支持动态调整）
│   └── book-status.ts    # 状态枚举
├── dto/                  # 数据传输对象
│   ├── index.ts          # DTO导出
│   ├── create.dto.ts     # 创建DTO
│   ├── update.dto.ts     # 更新DTO
│   ├── query.dto.ts      # 查询DTO
│   └── response.dto.ts   # 响应DTO（使用实体生成）
├── book.repository.ts     # 仓储层（使用实体）
├── book.service.ts       # 服务层（使用实体）
├── book.controller.ts    # 控制器层（使用实体）
├── book.module.ts       # 模块定义
└── REFACTOR_ANALYSIS.md # 重构对比分析文档
```

## 核心设计思想

### 1. 封装数据与行为

将数据和操作数据的方法封装在同一个类中：

```typescript
export class Book extends BaseEntity {
  // 数据属性
  isbn: string
  name: string
  stock: number
  // ...

  // 行为方法
  canBeBorrowed(): boolean {
    return this.stock > 0 && !this.isDeleted()
  }

  borrow(): void {
    if (!this.canBeBorrowed()) {
      throw new Error('库存不足，无法借阅')
    }
    this.stock -= 1
    this.touch()
  }
}
```

### 2. 定义清晰的实体属性与方法

通过 getter 和方法提供清晰的接口：

```typescript
export class Book extends BaseEntity {
  // 计算属性
  get fullName(): string {
    return this.subname ? `${this.name}：${this.subname}` : this.name
  }

  get status(): BookStatus {
    if (this.isDeleted()) return BookStatus.DELETED
    if (this.stock === 0) return BookStatus.OUT_OF_STOCK
    if (this.stock <= Book.LOW_STOCK_THRESHOLD) return BookStatus.LOW_STOCK
    return BookStatus.AVAILABLE
  }

  // 业务方法
  calculateDueDate(borrowDate: Date = new Date()): Date {
    const dueDate = new Date(borrowDate)
    dueDate.setDate(dueDate.getDate() + Book.MAX_BORROW_DAYS)
    return dueDate
  }
}
```

### 3. 实现领域逻辑内聚

业务规则集中在实体内部：

```typescript
export class Book extends BaseEntity {
  // 业务常量
  private static readonly MAX_BORROW_DAYS = 30
  private static readonly LOW_STOCK_THRESHOLD = 5
  private static readonly MAX_STOCK = 100

  // 业务验证
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isbn || this.isbn.trim() === '') {
      errors.push('ISBN不能为空')
    } else if (!/^\d{10}$|^\d{13}$/.test(this.isbn.replace(/[-\s]/g, ''))) {
      errors.push('ISBN格式不正确，必须是10位或13位数字')
    }

    // ... 更多验证规则

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
```

## 模型字段定义与动态调整

### 基础字段定义

在 `book-fields.ts` 中定义基础字段集合：

```typescript
export const BOOK_BASE_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  subname: true,
  originalName: true,
  author: true,
  publisher: true,
  publicationYear: true,
  stock: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const satisfies Prisma.BookSelect

export type BookBaseType = Prisma.BookGetPayload<{ select: typeof BOOK_BASE_FIELDS }>
```

### 动态调整字段

通过**组合**和**扩展**实现字段的动态调整：

#### 组合扩展

```typescript
// 公开字段 - 不包含敏感信息
export const BOOK_PUBLIC_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  subname: true,
  originalName: true,
  author: true,
  publisher: true,
  publicationYear: true,
  description: true,
  createdAt: true,
} as const satisfies Prisma.BookSelect

// 管理字段 - 在公开字段基础上添加
export const BOOK_ADMIN_FIELDS = {
  ...BOOK_PUBLIC_FIELDS,  // 组合公开字段
  stock: true,           // 添加库存字段
  updatedAt: true,         // 添加更新时间
} as const satisfies Prisma.BookSelect
```

#### 简化字段

```typescript
// 摘要字段 - 只包含必要信息
export const BOOK_SUMMARY_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  author: true,
  stock: true,
} as const satisfies Prisma.BookSelect
```

### 字段定义的使用

#### Repository层

```typescript
async findAll(
  page: number,
  take: number,
  skip: number,
  where: Prisma.BookWhereInput,
  orderBy: Prisma.BookOrderByWithRelationInput
): Promise<{ data: Book[]; total: number; page: number; take: number }> {
  const [data, total] = await Promise.all([
    this.prisma.book.findMany({
      where,
      skip,
      take,
      orderBy,
      select: BOOK_BASE_FIELDS,  // 使用基础字段
    }),
    this.prisma.book.count({ where }),
  ])
  return {
    data: Book.fromPrismaArray(data),
    total,
    page,
    take,
  }
}

async findPublic(id: number): Promise<Book> {
  const data = await this.prisma.book.findUnique({
    where: { id, deletedAt: null },
    select: BOOK_PUBLIC_FIELDS,  // 使用公开字段
  })
  if (!data) {
    throw new NotFoundException(`图书ID ${id} 不存在`)
  }
  return Book.fromPrisma(data)
}

async findSummaries(where: Prisma.BookWhereInput): Promise<Book[]> {
  const data = await this.prisma.book.findMany({
    where,
    select: BOOK_SUMMARY_FIELDS,  // 使用摘要字段
  })
  return Book.fromPrismaArray(data)
}
```

#### 实体类转换

```typescript
export class Book extends BaseEntity {
  toPublic(): BookPublicType {
    return {
      id: this.id,
      isbn: this.isbn,
      name: this.name,
      subname: this.subname,
      originalName: this.originalName,
      author: this.author,
      publisher: this.publisher,
      publicationYear: this.publicationYear,
      description: this.description,
      createdAt: this.createdAt,
      // 不包含 stock, updatedAt, deletedAt
    }
  }

  toSummary(): BookSummaryType {
    return {
      id: this.id,
      isbn: this.isbn,
      name: this.name,
      author: this.author,
      stock: this.stock,
      // 只包含必要字段
    }
  }
}
```

## 使用示例

### 创建图书

```typescript
// Controller
@Post()
async create(@Body() createDto: CreateDto) {
  const book = await this.bookService.create(createDto)
  return BookDetailDto.fromEntity(book)
}

// Service
async create(data: CreateDto): Promise<Book> {
  const book = new Book(data)
  const validation = book.validate()
  if (!validation.valid) {
    throw new AppException(
      `图书数据验证失败: ${validation.errors.join(', ')}`,
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST
    )
  }

  const isbnExists = await this.bookRepository.existsByIsbn(data.isbn)
  if (isbnExists) {
    throw new AppException('ISBN已存在', 'BOOK_ISBN_EXISTS', HttpStatus.CONFLICT)
  }

  return this.bookRepository.create(data)
}
```

### 借阅图书

```typescript
// Controller
@Post(':id/borrow')
async borrow(@Param('id') id: number) {
  const book = await this.bookService.borrow(id)
  return BookDetailDto.fromEntity(book)
}

// Service
async borrow(id: number): Promise<Book> {
  const book = await this.bookRepository.findById(id)

  if (!book.canBeBorrowed()) {
    if (book.stock <= 0) {
      throw new AppException('库存不足，无法借阅', 'BOOK_OUT_OF_STOCK', HttpStatus.BAD_REQUEST)
    }
    if (book.isDeleted()) {
      throw new AppException('图书已删除，无法借阅', 'BOOK_DELETED', HttpStatus.BAD_REQUEST)
    }
  }

  book.borrow()
  await this.bookRepository.updateStock(id, -1)
  return this.bookRepository.findById(id)
}

// Entity
borrow(): void {
  if (!this.canBeBorrowed()) {
    if (this.stock <= 0) {
      throw new Error('库存不足，无法借阅')
    }
    if (this.isDeleted()) {
      throw new Error('图书已删除，无法借阅')
    }
  }
  this.stock -= 1
  this.touch()
}
```

### 获取补货建议

```typescript
// Controller
@Get('restock/suggestions')
async getRestockSuggestions() {
  const suggestions = await this.bookService.getRestockSuggestions()
  return suggestions.map(item => ({
    book: BookDetailDto.fromEntity(item.book),
    quantity: item.quantity,
  }))
}

// Service
async getRestockSuggestions(): Promise<Array<{ book: Book; quantity: number }>> {
  const books = await this.bookRepository.findSummaries({ deletedAt: null })
  return books
    .filter(book => book.needsRestock())
    .map(book => ({
      book,
      quantity: book.calculateRestockQuantity(),
    }))
}

// Entity
needsRestock(): boolean {
  return this.stock <= Book.LOW_STOCK_THRESHOLD && !this.isDeleted()
}

calculateRestockQuantity(): number {
  if (this.stock === 0) return 10
  if (this.stock <= Book.LOW_STOCK_THRESHOLD) return 5
  return 0
}
```

## 对比原有实现

详细的对比分析请参考 [REFACTOR_ANALYSIS.md](./REFACTOR_ANALYSIS.md)

### 主要区别

| 方面 | 原有实现（book） | 实体模式（nbook） |
|------|-------------------|---------------------|
| **业务逻辑位置** | Service层 | Entity层 |
| **数据验证** | DTO层 | Entity层 |
| **代码可读性** | 中等 | 高 |
| **代码复用性** | 低 | 高 |
| **扩展性** | 中等 | 高 |
| **学习成本** | 低 | 中等 |
| **代码量** | 少 | 多 |

## 优势

1. **业务逻辑内聚**：业务规则集中在实体内部，易于维护
2. **代码可读性高**：使用语义化的方法名，代码更易理解
3. **类型安全性强**：使用实体类型，类型检查更严格
4. **字段定义可复用**：通过组合和扩展实现字段的动态调整
5. **扩展性好**：添加新功能只需在实体中添加方法

## 缺点

1. **代码量增加**：相比原有实现，代码量增加约2-3倍
2. **学习成本较高**：需要理解实体设计模式和DDD思想
3. **性能开销**：需要将Prisma对象转换为实体，再转换为DTO
4. **过度设计风险**：对于简单项目可能过度设计

## 使用建议

### 何时使用实体模式

✅ **推荐使用**：
- 业务逻辑复杂，需要封装
- 有大量重复的业务规则
- 需要领域驱动设计
- 团队熟悉DDD和实体模式
- 项目长期维护，需要高扩展性

❌ **不推荐使用**：
- 项目简单，主要是CRUD操作
- 业务逻辑少，不需要封装
- 团队不熟悉实体模式
- 项目短期项目，不需要长期维护

### 当前项目建议

基于当前项目的实际情况，建议：

**短期（1-3个月）**：
- ✅ 保持原有架构（book模块）
- ✅ 继续使用Prisma + zod
- ✅ 将nbook作为参考实现

**中期（3-6个月）**：
- 📊 监控业务复杂度
- 📊 评估是否需要引入实体模式
- 📊 收集团队反馈

**长期（6个月+）**：
- 🔄 如果业务复杂度增加，考虑引入实体模式
- 🔄 可以先在某个模块试点
- 🔄 逐步推广到其他模块

## 总结

`nbook` 模块展示了实体模式的核心设计思想：

1. **封装数据与行为**：将数据和操作数据的方法封装在同一个类中
2. **定义清晰的实体属性与方法**：通过 getter 和方法提供清晰的接口
3. **实现领域逻辑内聚**：业务规则集中在实体内部，避免分散在Service层
4. **字段定义复用**：通过组合和扩展实现字段的动态调整

实体模式相比原有实现的优势在于业务逻辑更集中、代码可读性更高、类型安全性更强、字段定义可复用、扩展性更好。但同时也存在代码量增加、学习成本较高、有一定性能开销、对于简单项目可能过度设计等缺点。

**最终建议**：根据项目实际情况选择合适的架构，不要盲目追求复杂的设计模式。
