import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
import { AuthGuard } from '@common/guards/auth.guard'
import { UserService } from './user.service'
import { User } from './user.entity'
import { CreateDto, UpdateDto, QueryDto, ListResDto, ResponseDto } from './dto/index'
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common'

@ApiTags('用户管理')
@Controller('users')
// @Roles(RoleType.ADMIN)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiOk(ListResDto)
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.userService.findAll(query)
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id)
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Put()
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateDto) {
    return await this.userService.update(id, updateData)
  }

  @ApiOperation({ summary: '停用用户' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Delete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id)
  }

  @ApiOperation({ summary: '批量删除用户' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Delete('many')
  async deleteMany(@Body('ids') ids: string) {
    return await this.userService.deleteMany(ids)
  }

  @ApiOperation({ summary: '激活用户' })
  @ApiOk(ResponseDto, '激活成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Put(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.activate(id)
  }

  @ApiOperation({ summary: '批量激活用户' })
  @ApiOk(ResponseDto, '激活成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Put('many/activate')
  async activateMany(@Body('ids') ids: string) {
    return await this.userService.activateMany(ids)
  }
}
