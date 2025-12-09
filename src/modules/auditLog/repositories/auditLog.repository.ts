import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { AuditLog } from '../entities/auditLog.entity';
import { CreateAuditLogDto, UpdateAuditLogDto } from '../dto/index';

@Injectable()
export class AuditLogRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找审计日志
   * @param id 审计日志ID
   * @returns 审计日志对象或null
   */
  async findById(id: number): Promise<AuditLog | null> {
    const auditLogData = await this.prisma.auditLog.findUnique({
      where: { id }
    });
    
    // 将Prisma查询结果转换为AuditLog实体类实例，以支持虚拟属性name   
    return auditLogData ? new AuditLog(auditLogData) : null;
  }

  /**
   * 通过名称查找审计日志
   * @param name 审计日志名称
   * @returns 审计日志对象或null
   */
  async findByUserId(userId: number): Promise<AuditLog[] | null> {
    const auditLogData = await this.prisma.auditLog.findMany({
      where: { userId }
    });
    
    // 将Prisma查询结果转换为AuditLog实体类实例，以支持虚拟属性name
    return auditLogData ? auditLogData.map(item => new AuditLog(item)) : null;
  }


  /**
   * 创建新审计日志
   * @param auditLogData 审计日志数据
   * @returns 创建的审计日志
   */
  async create(auditLogData: Partial<CreateAuditLogDto>): Promise<AuditLog> {
    const createdAuditLog = await this.prisma.auditLog.create({
      data: {
        userId: auditLogData.userId as number,
        action: auditLogData.action as string,
        resource: auditLogData.resource as string,
        resourceId: auditLogData.resourceId as string,
        details: auditLogData.details as string,
        duration: auditLogData.duration as number,
        timestamp: auditLogData.timestamp as Date,
        isSuccess: auditLogData.isSuccess as boolean,
        method: auditLogData.method as string,
        path: auditLogData.path as string,
        ip: auditLogData.ip as string,
        userAgent: auditLogData.userAgent as string,
      },
    });
    
    // 将创建的审计日志数据转换为AuditLog实体类实例
    return new AuditLog(createdAuditLog);
  }

  /**
   * 更新审计日志
   * @param id 审计日志ID   
   * @param updateData 更新数据
   * @returns 更新后的审计日志
   */
  async update(id: number, updateData: UpdateAuditLogDto): Promise<AuditLog> {
    const updatedAuditLog = await this.prisma.auditLog.update({
      where: { id },
      data: {
        action: updateData.action as string,
        resource: updateData.resource as string,
        resourceId: updateData.resourceId as string,
        details: updateData.details as string,
        updatedAt: new Date(),
      },
    });
    
    // 将更新后的审计日志数据转换为AuditLog实体类实例
    return new AuditLog(updatedAuditLog);
  }     

  /**
   * 获取审计日志列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 审计日志列表和总数
   */
  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    
    // 如果filters中包含userId字段且为字符串类型，转换为数字
    if (filters.userId && typeof filters.userId === 'string') {
      filters.userId = parseInt(filters.userId, 10);
    }
    
    const [auditLogsData, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: {
          ...filters,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where: filters }),
    ]);

    // 将审计日志数据数组转换为AuditLog实体类实例数组
    const auditLogs = auditLogsData.map(auditLogData => new AuditLog(auditLogData));

    return {
      data: auditLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 删除审计日志
   * @param id 审计日志ID   
   */
  async delete(id: number): Promise<void> {
    await this.prisma.auditLog.delete({ 
      where: { id },
    });
  }
}