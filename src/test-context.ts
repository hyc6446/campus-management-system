import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 测试拦截器，演示如何获取NestJS中的各种上下文对象
 */
export class TestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. 获取HTTP上下文
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    console.log('=== HTTP 上下文演示 ===');
    
    // 2. 获取请求参数
    console.log('Request 对象:', request);
    
    // 3. 获取查询参数 (Query)
    console.log('查询参数 (Query):', request.query);
    
    // 4. 获取请求体 (Body)
    console.log('请求体 (Body):', request.body);
    
    // 5. 获取路由参数 (Params)
    console.log('路由参数 (Params):', request.params);
    
    // 6. 获取请求头 (Headers)
    console.log('请求头 (Headers):', request.headers);
    
    // 7. 从ExecutionContext直接获取参数
    console.log('\n=== 从 ExecutionContext 获取参数 ===');
    const args = context.getArgs();
    console.log('所有参数:', args);
    
    // 通常第一个参数是request，第二个是response
    if (args.length > 0) {
      const reqFromArgs = args[0];
      console.log('从参数中获取的Request:', reqFromArgs);
    }
    
    // 9. 比较 context.getArgs() 和 request 对象获取参数的区别
    console.log('\n=== context.getArgs() 与 request 对象的区别 ===');
    console.log('1. context.getArgs() 返回值类型:', Array.isArray(args) ? '数组' : typeof args);
    console.log('2. args 数组长度:', args.length);
    console.log('3. args[0] 与 request 是否为同一个对象:', args[0] === request);
    
    // 演示在不同场景下的区别
    console.log('\n=== 应用场景区别演示 ===');
    console.log('通过 request 获取的 query:', request.query);
    console.log('通过 args[0] 获取的 query:', args[0]?.query);
    console.log('通过 request 获取的 params:', request.params);
    console.log('通过 args[0] 获取的 params:', args[0]?.params);
    console.log('通过 request 获取的 body:', request.body);
    console.log('通过 args[0] 获取的 body:', args[0]?.body);
    
    // 8. 获取控制器和方法信息
    console.log('\n=== 控制器和方法信息 ===');
    console.log('控制器名称:', context.getClass().name);
    console.log('方法名称:', context.getHandler().name);

    return next.handle();
  }
}

/**
 * 控制器示例，演示如何通过装饰器获取这些对象
 */
/*
@Controller('test')
export class TestController {
  @Get(':id')
  // 通过装饰器直接获取
  findOne(
    @Param('id') id: string, // 路由参数
    @Query() query: any, // 查询参数
    @Headers() headers: any, // 请求头
    @Req() request: Request, // 完整请求对象
    @Res() response: Response // 完整响应对象
  ) {
    console.log('ID:', id);
    console.log('Query:', query);
    console.log('Headers:', headers);
    return { id, query };
  }
  
  @Post()
  create(@Body() body: any) { // 请求体
    console.log('Body:', body);
    return body;
  }
}
*/
