import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaService } from './prisma.service'

/**
 * 自定义模型名称类型，确保只能使用有效的Prisma模型名称
 */
type ModelName = keyof Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * 基础仓库类
 * @template T - 实体模型名称类型
 * @template K - 实体返回类型
 */
export class BaseRepository<T extends ModelName, K> {
  // 使用更精确的类型表示Prisma模型，不再使用泛型索引
  protected model: any

  /**
   * 构造函数
   * @param prisma - Prisma服务实例
   * @param modelName - 模型名称
   */
  constructor(prisma: PrismaService, modelName: T) {
    // 确保类型安全地访问Prisma模型
    this.model = prisma[modelName]
  }

  /**
   * 根据ID查找单个记录
   * @param id - 记录ID
   * @param select - 选择返回字段
   * @returns 找到的记录
   */
  async findById<Select extends Record<string, any> = Record<string, never>>(
    id: string,
    select?: Select
  ): Promise<Select extends Record<string, never> ? K : Partial<K>> {
    return this.model.findUnique({
      where: { id },
      select,
    })
  }

  /**
   * 根据条件查找多个记录
   * @param where - 查询条件
   * @param select - 选择返回字段
   * @returns 记录数组
   */
  async findBy<Select extends Record<string, any> = Record<string, never>>(
    where: Record<string, any>,
    select?: Select
  ): Promise<(Select extends Record<string, never> ? K : Partial<K>)[]> {
    return this.model.findMany({
      where,
      select,
    })
  }

  /**
   * 根据条件查找单个记录
   * @param where - 查询条件
   * @param select - 选择返回字段
   * @returns 找到的记录或null
   */
  async findOne<Select extends Record<string, any> = Record<string, never>>(
    where: Record<string, any>,
    select?: Select
  ): Promise<(Select extends Record<string, never> ? K : Partial<K>) | null> {
    return this.model.findFirst({
      where,
      select,
    })
  }

  /**
   * 创建新记录
   * @param data - 创建数据
   * @param select - 选择返回字段
   * @returns 创建的记录
   */
  async create<Select extends Record<string, any> = Record<string, never>>(
    data: Record<string, any>,
    select?: Select
  ): Promise<Select extends Record<string, never> ? K : Partial<K>> {
    return this.model.create({
      data,
      select,
    })
  }

  /**
   * 更新记录
   * @param id - 记录ID
   * @param data - 更新数据
   * @param select - 选择返回字段
   * @returns 更新后的记录
   */
  async update<Select extends Record<string, any> = Record<string, never>>(
    id: string,
    data: Record<string, any>,
    select?: Select
  ): Promise<Select extends Record<string, never> ? K : Partial<K>> {
    return this.model.update({
      where: { id },
      data,
      select,
    })
  }

  /**
   * 删除记录
   * @param id - 记录ID
   * @returns 删除的记录
   */
  async delete(id: string): Promise<K> {
    return this.model.delete({
      where: { id },
    })
  }

  /**
   * 统计记录数量
   * @param where - 查询条件
   * @returns 记录数量
   */
  async count(where?: Record<string, any>): Promise<number> {
    return this.model.count({ where })
  }

  /**
   * 分页查询
   * @param page - 页码
   * @param pageSize - 每页大小
   * @param where - 查询条件
   * @param orderBy - 排序条件
   * @param select - 选择返回字段
   * @returns 分页结果
   */
  async paginate<Select extends Record<string, any> = Record<string, never>>(
    page: number = 1,
    pageSize: number = 10,
    where?: Record<string, any>,
    orderBy?: Record<string, any>,
    select?: Select
  ): Promise<{
    data: (Select extends Record<string, never> ? K : Partial<K>)[]
    total: number
    page: number
    pageSize: number
  }> {
    const [total, data] = await Promise.all([
      this.count(where),
      this.model.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy,
        select,
      }),
    ])

    return {
      data,
      total,
      page,
      pageSize,
    }
  }
}
