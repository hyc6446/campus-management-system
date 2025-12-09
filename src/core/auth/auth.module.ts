/**
 * 认证核心模块
 * 
 * 此模块是NestJS应用程序的认证核心，集成了Passport、JWT等认证相关组件，
 * 提供了完整的身份验证基础设施。作为核心模块，它不直接暴露API端点，
 * 而是通过导出AuthService供其他业务模块（如@modules/auth）使用。
 */

// 导入NestJS核心模块装饰器
import { Module } from '@nestjs/common';
// 导入JWT模块，用于JWT令牌的生成和验证
// 导入JWT模块，用于JWT令牌的生成和验证
import { JwtModule } from '@nestjs/jwt';
// 导入Passport模块，提供认证框架支持
import { PassportModule } from '@nestjs/passport';
// 导入配置模块和配置服务
import { ConfigModule, ConfigService } from '@nestjs/config';
// 导入认证服务
import { AuthService } from './auth.service';
// 导入JWT策略，处理JWT令牌验证
import { JwtStrategy } from './jwt.strategy';
// 导入本地策略，处理用户名密码验证
import { LocalStrategy } from './local.strategy';
// 导入用户仓库，用于用户数据访问
import { UserRepository } from '@modules/user/repositories/user.repository';
// 导入用户模块，提供用户相关功能
import { UserModule } from '@modules/user/user.module';
// 导入令牌模块，提供令牌相关功能
import { TokenModule } from '@modules/token/token.module';

@Module({
  imports: [
    // 导入Passport模块，为应用提供认证框架，并设置默认策略为jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 导入用户模块，提供用户相关功能
    UserModule,
    // 导入令牌模块，提供令牌相关功能
    TokenModule,
    
    /**
     * 异步注册JWT模块
     * 
     * 使用registerAsync方法异步配置JWT模块，确保在应用启动时
     * 能够从配置服务中获取最新的JWT配置信息。
     */
    JwtModule.registerAsync({
      // 导入ConfigModule以访问配置服务
      imports: [ConfigModule],
      // 注入ConfigService用于获取JWT配置
      inject: [ConfigService],
      // 使用工厂函数异步创建JWT模块配置
      useFactory: async (configService: ConfigService) => ({
        // 设置JWT签名密钥，从配置服务中获取
        secret: configService.get('auth.jwtSecret'),
        // 设置JWT签名选项
        signOptions: { 
          // 设置令牌过期时间，从配置服务中获取
          expiresIn: configService.get('auth.jwtExpiresIn') 
        },
      }),
    }),
  ],
  providers: [
    // 认证服务，提供核心认证功能
    AuthService,
    // JWT策略，处理JWT令牌验证逻辑
    JwtStrategy,
    // 本地策略，处理用户名密码验证逻辑
    LocalStrategy,
    // 用户仓库，提供用户数据访问功能
    UserRepository
  ],
  exports: [
    // 导出AuthService，使其可被其他业务模块使用
    AuthService,
    // 导出JwtModule，使其在全局范围内可用
    JwtModule,
  ],
})
export class AuthCoreModule {}