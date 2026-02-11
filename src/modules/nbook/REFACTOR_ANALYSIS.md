# 实体模式重构对比分析文档

## 目录
1. [重构概述](#重构概述)
2. [实体设计思想](#实体设计思想)
3. [模型字段定义与动态调整](#模型字段定义与动态调整)
4. [代码对比分析](#代码对比分析)
5. [优势与缺点](#优势与缺点)
6. [使用建议](#使用建议)

---

## 重构概述

本次重构将原有的 `book` 模块使用实体模式进行了完整重构，新的实现在 `nbook` 目录中。重构重点体现了以下设计思想：

- **封装数据与行为**：将数据和操作数据的方法封装在同一个类中
- **定义清晰的实体属性与方法**：通过 getter 和方法提供清晰的接口
- **实现领域逻辑内聚**：业务规则集中在实体内部，避免分散在Service层

---

## 实体设计思想

### 1. 封装数据与行为

**原有实现（book）**：
```typescript
// Service层分散的业务逻辑
async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
  const book = await this.bookRepository.findByIdOptionalWithFull(id)
  if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
  
  if (data.isbn) {
    const isbnExist = await this.bookRepository.findByIsbnOptional(data.isbn)
    if (isbnExist && isbnExist.id !== id)
      throw new AppException('ISBN已存在', 'Book_Exist', HttpStatus.CONFLICT)
  }
  
  if (book.deletedAt)
    throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)

  return this.bookRepository.update(id, data)
}
```

**实体模式实现（nbook）**：
```typescript
// 实体内部封装业务逻辑
export class Book extends BaseEntity {
  canBeDeleted(): boolean {
    return this.stock === 0 && !this.isDeleted()
  }

  delete(): void {
    if (!this.canBeDeleted()) {
      if (this.stock > 0) {
        throw new Error('还有库存的图书不能删除')
      }
      if (this.isDeleted()) {
        throw new Error('图书已删除')
      }
    }
    this.softDelete()
  }
}

// Service层变得简洁
async delete(id: number): Promise<Book> {
  const book = await this.bookRepository.findById(id)
  book.delete()
  return this.bookRepository.delete(id)
}
```

### 2. 定义清晰的实体属性与方法

**原有实现**：
```typescript
// 直接访问字段，没有语义化方法
if (book.stock > 0 && !book.deletedAt) {
  // 借阅逻辑
}
```

**实体模式实现**：
```typescript
// 使用语义化的方法
if (book.canBeBorrowed()) {
  book.borrow()
}

// 使用计算属性
console.log(book.fullName)        // "JavaScript高级程序设计：第4版"
console.log(book.statusLabel)     // "可借阅"
console.log(book.publicationInfo) // "人民邮电出版社 · 2020年出版"
```

### 3. 实现领域逻辑内聚

**原有实现**：业务规则分散在多个Service方法中
```typescript
// 在多个地方重复相同的判断逻辑
if (book.stock <= 0) {
  throw new AppException('库存不足', 'Book_Stock_Insufficient', HttpStatus.BAD_REQUEST)
}
```

**实体模式实现**：业务规则集中在实体内部
```typescript
export class Book extends BaseEntity {
  private static readonly LOW_STOCK_THRESHOLD = 5
  private static readonly MAX_STOCK = 100
  
  get status(): BookStatus {
    if (this.isDeleted()) return BookStatus.DELETED
    if (this.stock === 0) return BookStatus.OUT_OF_STOCK
    if (this.stock <= Book.LOW_STOCK_THRESHOLD) return BookStatus.LOW_STOCK
    return BookStatus.AVAILABLE
  }
  
  canBeBorrowed(): boolean {
    return this.stock > 0 && !this.isDeleted()
  }
}
```

---

## 模型字段定义与动态调整

### 1. 基础字段定义（BOOK_BASE_FIELDS）

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

### 2. 动态调整字段定义

通过**组合**和**扩展**实现字段的动态调整：

#### 方式1：组合扩展（推荐）

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

#### 方式2：简化字段

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

### 3. 字段定义的使用

#### Repository层使用

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

### 4. 实体类中的字段转换

```typescript
export class Book extends BaseEntity {
  // ... 字段定义

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

---

## 代码对比分析

### 1. Service层对比

#### 原有实现（book）

```typescript
async create(data: CreateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
  const book = await this.bookRepository.findByIsbnOptional(data.isbn)
  if (book) throw new AppException('书籍已存在', 'Book_Exist', HttpStatus.CONFLICT)
  return this.bookRepository.create(data)
}

async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
  const book = await this.bookRepository.findByIdOptionalWithFull(id)
  if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
  
  if (data.isbn) {
    const isbnExist = await this.bookRepository.findByIsbnOptional(data.isbn)
    if (isbnExist && isbnExist.id !== id)
      throw new AppException('ISBN已存在', 'Book_Exist', HttpStatus.CONFLICT)
  }
  
  if (book.deletedAt)
    throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)

  return this.bookRepository.update(id, data)
}
```

#### 实体模式实现（nbook）

```typescript
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

async update(id: number, data: UpdateDto): Promise<Book> {
  const book = await this.bookRepository.findById(id)

  if (data.isbn) {
    const isbnExists = await this.bookRepository.existsByIsbn(data.isbn, id)
    if (isbnExists) {
      throw new AppException('ISBN已存在', 'BOOK_ISBN_EXISTS', HttpStatus.CONFLICT)
    }
  }

  const updatedBook = new Book({ ...book.toPrismaInput(), ...data })
  const validation = updatedBook.validate()
  if (!validation.valid) {
    throw new AppException(
      `图书数据验证失败: ${validation.errors.join(', ')}`,
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST
    )
  }

  return this.bookRepository.update(id, data)
}
```

**对比分析**：
- ✅ 实体模式增加了数据验证逻辑
- ✅ 实体模式代码更清晰，职责更明确
- ✅ 实体模式可以复用验证逻辑

### 2. 业务逻辑对比

#### 原有实现

```typescript
// 业务逻辑分散在Service层
async reserve(id: number): Promise<boolean> {
  const book = await this.bookRepository.findByIdOptionalWithFull(id)
  if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
  if (book.deletedAt)
    throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)
  if (book.stock <= 0)
    throw new AppException('库存不足', 'Book_Stock_Insufficient', HttpStatus.BAD_REQUEST)

  return this.bookRepository.reserve(id)
}
```

#### 实体模式实现

```typescript
// 业务逻辑封装在实体中
export class Book extends BaseEntity {
  canBeBorrowed(): boolean {
    return this.stock > 0 && !this.isDeleted()
  }

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
}

async borrow(id: number): Promise<Book> {
  const book = await this.bookRepository.findById(id)
  book.borrow()
  await this.bookRepository.updateStock(id, -1)
  return this.bookRepository.findById(id)
}
```

**对比分析**：
- ✅ 实体模式业务逻辑更集中
- ✅ 实体模式可以复用业务方法
- ✅ 实体模式Service层更简洁

### 3. 数据转换对比

#### 原有实现

```typescript
// 直接返回Prisma对象
async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_TYPE>> {
  const {
    page = 1,
    limit: take = 10,
    sortBy = 'createdAt',
    order = 'desc',
    id,
    name,
    isbn,
    author,
    publicationYear,
    createdAt,
  } = query
  const skip = (page - 1) * take
  const where: Prisma.BookWhereInput = { deletedAt: null }
  if (id) where.id = id
  if (name) where.name = { contains: name }
  if (isbn) where.isbn = { contains: isbn }
  if (author) where.author = { contains: author }
  if (publicationYear) where.publicationYear = { gte: Number(publicationYear) }
  if (createdAt) where.createdAt = { gte: new Date(createdAt) }
  const orderBy: Prisma.BookOrderByWithRelationInput =
    sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
  return this.bookRepository.findAll(page, take, skip, where, orderBy)
}
```

#### 实体模式实现

```typescript
// 使用实体方法进行数据转换
async findAll(query: QueryDto): Promise<{ data: Book[]; total: number; page: number; take: number }> {
  const { page, limit, sortBy, order, id, name, isbn, author, publicationYear, createdAt } = query
  const skip = (page - 1) * limit
  const where: Prisma.BookWhereInput = { deletedAt: null }

  if (id) where.id = id
  if (name) where.name = { contains: name }
  if (isbn) where.isbn = { contains: isbn }
  if (author) where.author = { contains: author }
  if (publicationYear) where.publicationYear = { gte: Number(publicationYear) }
  if (createdAt) where.createdAt = { gte: new Date(createdAt) }

  const orderBy: Prisma.BookOrderByWithRelationInput = { [sortBy]: order }

  const result = await this.bookRepository.findAll(page, limit, skip, where, orderBy)

  return {
    ...result,
    data: result.data,  // Repository已经转换为实体
  }
}

// Controller层使用DTO转换
@Get()
async findAll(@Query() query: QueryDto) {
  const result = await this.bookService.findAll(query)
  return {
    ...result,
    data: BookFrontendDto.fromEntities(result.data),  // 转换为前端格式
  }
}
```

**对比分析**：
- ✅ 实体模式数据转换更灵活
- ✅ 实体模式可以定义多种转换格式
- ✅ 实体模式转换逻辑可复用

---

## 优势与缺点

### 优势

#### 1. 业务逻辑内聚

**原有实现**：
- ❌ 业务逻辑分散在Service层
- ❌ 相同的业务规则在多个地方重复
- ❌ 难以维护和测试

**实体模式**：
- ✅ 业务逻辑集中在实体内部
- ✅ 业务规则可以复用
- ✅ 易于维护和测试

#### 2. 代码可读性

**原有实现**：
```typescript
if (book.stock > 0 && !book.deletedAt) {
  // 借阅逻辑
}
```

**实体模式**：
```typescript
if (book.canBeBorrowed()) {
  book.borrow()
}
```

#### 3. 类型安全

**原有实现**：
```typescript
// 使用Prisma生成的类型
async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_TYPE>>
```

**实体模式**：
```typescript
// 使用实体类型，更明确
async findAll(query: QueryDto): Promise<{ data: Book[]; total: number; page: number; take: number }>
```

#### 4. 字段复用

**原有实现**：
```typescript
// 需要手动维护多个字段定义
export const DEFAULT_BOOK_FIELDS = {
  id: true,
  name: true,
  isbn: true,
  // ... 重复定义
}

export const SAFE_BOOK_FIELDS = {
  ...DEFAULT_BOOK_FIELDS,
  updatedAt: true,
}

export const FULL_BOOK_FIELDS = {
  ...SAFE_BOOK_FIELDS,
  deletedAt: true,
}
```

**实体模式**：
```typescript
// 通过组合实现字段复用
export const BOOK_PUBLIC_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  // ... 公开字段
}

export const BOOK_ADMIN_FIELDS = {
  ...BOOK_PUBLIC_FIELDS,  // 复用公开字段
  stock: true,
  updatedAt: true,
}
```

#### 5. 扩展性

**原有实现**：
- ❌ 添加新业务逻辑需要修改Service层
- ❌ 难以添加新的数据转换格式

**实体模式**：
- ✅ 添加新业务逻辑只需在实体中添加方法
- ✅ 可以轻松添加新的DTO转换格式

### 缺点

#### 1. 代码量增加

**原有实现**：
- Service层：~140行
- Repository层：~127行
- 总计：~267行

**实体模式**：
- Entity层：~320行
- Service层：~200行
- Repository层：~180行
- 总计：~700行

**分析**：虽然代码量增加，但代码更清晰、更易维护。

#### 2. 学习成本

**原有实现**：
- ✅ 团队熟悉Prisma + zod
- ✅ 学习成本低

**实体模式**：
- ⚠️ 需要理解实体设计模式
- ⚠️ 需要理解领域驱动设计思想

#### 3. 性能开销

**原有实现**：
- ✅ 直接使用Prisma对象，无转换开销

**实体模式**：
- ⚠️ 需要将Prisma对象转换为实体
- ⚠️ 需要将实体转换为DTO

**分析**：转换开销很小，可以忽略不计。

#### 4. 过度设计风险

**原有实现**：
- ✅ 简单直接，适合当前项目

**实体模式**：
- ⚠️ 对于简单项目可能过度设计
- ⚠️ 需要权衡复杂度和收益

---

## 使用建议

### 何时使用实体模式

✅ **推荐使用实体模式的场景**：
1. 业务逻辑复杂，需要封装
2. 有大量重复的业务规则
3. 需要领域驱动设计
4. 团队熟悉DDD和实体模式
5. 项目长期维护，需要高扩展性

❌ **不推荐使用实体模式的场景**：
1. 项目简单，主要是CRUD操作
2. 业务逻辑少，不需要封装
3. 团队不熟悉实体模式
4. 项目短期项目，不需要长期维护

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

---

## 总结

实体模式重构体现了以下核心设计思想：

1. **封装数据与行为**：将数据和操作数据的方法封装在同一个类中
2. **定义清晰的实体属性与方法**：通过 getter 和方法提供清晰的接口
3. **实现领域逻辑内聚**：业务规则集中在实体内部，避免分散在Service层
4. **字段定义复用**：通过组合和扩展实现字段的动态调整

实体模式相比原有实现的优势：
- ✅ 业务逻辑更集中、更易维护
- ✅ 代码可读性更高
- ✅ 类型安全性更强
- ✅ 字段定义可复用
- ✅ 扩展性更好

实体模式相比原有实现的缺点：
- ⚠️ 代码量增加
- ⚠️ 学习成本较高
- ⚠️ 有一定的性能开销
- ⚠️ 对于简单项目可能过度设计

**最终建议**：根据项目实际情况选择合适的架构，不要盲目追求复杂的设计模式。
