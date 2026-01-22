  /**
   * 通过邮箱查找用户 - 支持灵活查询配置
   * @param where 唯一查询条件
   * @param options 查询选项（Prisma原生格式，支持select）
   * @returns 用户对象或null
   */
  // async findByEmail_old<K extends Prisma.UserWhereUniqueInput, T extends Omit<Partial<Prisma.UserFindUniqueArgs>, 'where'> = typeof DEFAULT_USER_AND_ROLE_FULL>(
  //   where: K,
  //   options?: T
  // ): Promise<Prisma.UserGetPayload<{ where: K } & T> | null>  {
  //   return this.findUnique(where, options);
  // }


    /**
   * 通过唯一条件查找用户 - 支持灵活查询配置
   * @param where 唯一查询条件
   * @param options 查询选项（Prisma原生格式，支持select/include）
   * @returns 用户对象或null
   */
  // async findUnique<
  //   K extends Prisma.UserWhereUniqueInput,
  //   T extends Omit<Partial<Prisma.UserFindUniqueArgs>, 'where'> = typeof DEFAULT_USER_AND_ROLE_FULL
  // >(where: K, options?: T): Promise<Prisma.UserGetPayload<{ where: K } & T> | null> {
  //   const queryArgs = {
  //     where,
  //     ...(options || DEFAULT_USER_AND_ROLE_FULL),
  //   } as { where: K } & T

  //   const userData = await this.prisma.user.findUnique(queryArgs)
  //   return userData as Prisma.UserGetPayload<{ where: K } & T> | null
  // }
  /**
   * 通过ID查找用户
   * @param id 用户ID
   * @returns 用户对象或null
   */
  // async findById<T extends Prisma.UserFindUniqueArgs>(queryArgs: T): Promise<Prisma.UserGetPayload<T> | null> {
  //   const userData = await this.prisma.user.findUnique(queryArgs)
  //   if (!userData) {
  //     return null
  //   }
  //   return userData as Prisma.UserGetPayload<T>
  // }



    /**
   * 通过ID查找用户
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  // async findById<T extends Omit<Partial<Prisma.UserFindUniqueArgs>, 'where'>>(
  //   id: number,
  //   options?: T
  // ): Promise<User | null> {
  //   const queryArgs: Prisma.UserFindUniqueArgs = {
  //     where: { id, deletedAt: null },
  //     ...DEFAULT_USER_WITH_ROLE,
  //     ...options,
  //   }

  //   const user = await this.userRepository.findById(queryArgs)
  //   if (!user) {
  //     throw new NotFoundException('用户不存在')
  //   }

  //   return user
  // }
  /**
   * 通过邮箱查找用户（可选）- 支持灵活查询配置
   * @param email 用户邮箱
   * @param options 查询选项，支持select和include
   * @returns 用户对象或null，包含默认的角色信息
   */
  // async findByEmailOptional_old<T extends Omit<Partial<Prisma.UserFindUniqueArgs>, 'where'>>(email: string, options?: T):
  // Promise<User | null> {

  //   const where={ email, deletedAt: null };

  //   const user = await this.userRepository.findByEmail(where, options);
  //   return user;
  // }