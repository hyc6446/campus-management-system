import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from './redis.service'
import { ConfigService } from '@nestjs/config'

describe('RedisService', () => {
  let service: RedisService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue: any) => {
              switch (key) {
                case 'REDIS_HOST':
                  return 'localhost';
                case 'REDIS_PORT':
                  return 6379;
                case 'REDIS_PASSWORD':
                  return '';
                case 'REDIS_DB':
                  return 0;
                default:
                  return defaultValue;
              }
            }),
          },
        },
      ],
    }).compile()

    service = module.get<RedisService>(RedisService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
