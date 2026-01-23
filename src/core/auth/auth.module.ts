// 导入NestJS核心模块装饰器
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserRepository } from '@modules/user/user.repository';
import { UserModule } from '@modules/user/user.module';
import { TokenModule } from '@modules/token/token.module';
import { RedisModule } from '@core/redis/redis.module';

@Module({
  imports: [
    // 导入Passport模块，为应用提供认证框架，并设置默认策略为jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    TokenModule,
    RedisModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      // 注入ConfigService用于获取JWT配置
      inject: [ConfigService],
      // 使用工厂函数异步创建JWT模块配置
      useFactory: async (configService: ConfigService) => ({
        // 设置JWT签名密钥，从配置服务中获取
        secret: configService.get('auth.jwtSecret'),
        signOptions: { 
          expiresIn: configService.get('auth.jwtExpiresIn') 
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    UserRepository
  ],
  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthCoreModule {}