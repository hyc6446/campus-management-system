import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuditLogRepository } from './repositories/auditLog.repository';
import { AuditLog } from './entities/auditLog.entity';
import { CreateAuditLogDto, UpdateAuditLogDto } from './dto/index';
import { CaslService } from '@core/casl/casl.service';
import { Action, Subjects, SubjectsEnum } from '@core/casl/casl.types';
import { User } from '@modules/user/user.entity';


@Injectable()
export class AuditLogService {
  constructor(
    private auditLogRepository: AuditLogRepository,
    private caslService: CaslService, 
  ) {}

  /**
   * 通过ID查找审计日志
   * @param id 审计日志ID
   * @returns 审计日志对象
   * @throws NotFoundException 审计日志不存在
   */
  async findById(id: number, currentUser: User): Promise<AuditLog> {
    const auditLog = await this.auditLogRepository.findById(id);
    if (!auditLog) {
      throw new NotFoundException('审计日志不存在');
    }
    
    // 权限检查：
    // 1. 普通用户只能查看自己的审计日志
    // 2. 管理员可以查看所有用户的审计日志
    if (currentUser.id !== auditLog.userId) {
      // 如果查询的不是自己的日志，需要管理员权限
      const hasAdminPermission = await this.caslService.can(currentUser, Action.Read, SubjectsEnum.AuditLog);
      if (!hasAdminPermission) {
        throw new ForbiddenException('无权限查看其他用户的审计日志');
      }
    }
    
    return auditLog;
  }

  /**
   * 通过用户ID查找审计日志
   * @param page 页码
   * @param limit 每页数量
   * @param userId 待查询用户ID
   * @param currentUser 当前登录用户
   * @returns 分页结果
   */
  async findByUserId(page: number, limit: number, userId: number, currentUser: User) {
    // 权限检查：
    // 1. 管理员可以查看所有用户的审计日志
    // 如果查询的不是自己的日志，需要管理员权限
    const hasAdminPermission = await this.caslService.can(currentUser, Action.Read, SubjectsEnum.AuditLog);
    if (!hasAdminPermission) {
      throw new ForbiddenException('无权限查看其他用户的审计日志');
    }
    return this.auditLogRepository.findAll(page, limit, { userId });
  }

  /**
   * 创建新审计日志
   * @param createAuditLogDto 审计日志数据
   * @param currentUser 当前登录用户
   * @returns 创建的审计日志
   */
  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogRepository.create(createAuditLogDto);
  }

  /**
   * 更新审计日志
   * @param id 审计日志ID
   * @param updateAuditLogDto 更新数据
   * @param currentUser 当前登录用户
   * @returns 更新后的审计日志
   * @throws ForbiddenException 无权限
   */
  async update(id: number, updateAuditLogDto: UpdateAuditLogDto, currentUser: User): Promise<AuditLog> {
    const auditLog = await this.findById(id, currentUser);
    // 检查用户是否有更新此审计日志的权限
    const ability = await this.caslService.getAbility(currentUser);
    if (!ability.can(Action.Update, SubjectsEnum.AuditLog)) {
      throw new ForbiddenException('无权限修改此审计日志');
    }
    
    return this.auditLogRepository.update(id, updateAuditLogDto);
  }

  /**
   * 获取分页审计日志列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @param currentUser 当前登录用户
   * @returns 分页结果
   */
  async findAll(page: number, limit: number, filters: any = {}, currentUser: User) {
    // 检查用户是否有查看审计日志列表的权限
    const ability = await this.caslService.getAbility(currentUser);
    if (!ability.can(Action.Read, SubjectsEnum.AuditLog)) {
      throw new ForbiddenException('无权限查看审计日志列表');
    }
    
    return this.auditLogRepository.findAll(page, limit, filters);
  }

  /**
   * 删除审计日志
   * @param id 审计日志ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number, currentUser: User): Promise<void> {
    const auditLog = await this.findById(id, currentUser);
    // 检查用户是否有删除此审计日志的权限
    const ability = await this.caslService.getAbility(currentUser);
    if (!ability.can(Action.Delete, SubjectsEnum.AuditLog)) {
      throw new ForbiddenException('无权限删除审计日志');
    }
    
    await this.auditLogRepository.delete(id);
  }

}