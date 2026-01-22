// // src/modules/course/course.controller.ts
// import { Controller, Post, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@common/guards/auth.guard';
// import { RolesGuard } from '@common/guards/roles.guard';
// import { Roles } from '@common/decorators/roles.decorator';
// import { CourseService } from './course.service';
// import { CreateCourseDto, UpdateCourseDto } from './dto';
// import { CurrentUser } from '@common/decorators/current-user.decorator';
// import { User } from '@modules/user/entities/user.entity';

// @Controller('courses')
// @UseGuards(AuthGuard, RolesGuard)
// export class CourseController {
//   constructor(private courseService: CourseService) {}

//   @Post()
//   @Roles('TEACHER', 'ADMIN') // 教师和管理员可以创建课程
//   async create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: User) {
//     return this.courseService.create(createCourseDto, user);
//   }

//   @Put(':id')
//   @Roles('TEACHER', 'ADMIN') // 教师和管理员可以更新课程
//   async update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto, @CurrentUser() user: User) {
//     return this.courseService.update(id, updateCourseDto, user);
//   }

//   @Get()
//   async findAll(@CurrentUser() user: User) {
//     return this.courseService.findAll(user);
//   }
// }