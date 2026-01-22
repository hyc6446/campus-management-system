// // src/modules/course/course.service.ts
// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { CaslFactory } from '@core/casl/casl.factory';
// import { User } from '@modules/user/entities/user.entity';
// import { Action, SubjectsEnum } from '@core/casl/casl.types';
// import { CourseRepository } from './repositories/course.repository';
// import { CreateCourseDto, UpdateCourseDto } from './dto';

// @Injectable()
// export class CourseService {
//   constructor(
//     private courseRepository: CourseRepository,
//     private caslFactory: CaslFactory
//   ) {}

//   // 创建课程
//   async create(createCourseDto: CreateCourseDto, user: User) {
//     const ability = await this.caslFactory.defineAbility(user);
    
//     // 检查权限
//     if (!ability.can(Action.Create, SubjectsEnum.Course)) {
//       throw new ForbiddenException('无权限创建课程');
//     }
    
//     // 教师只能创建自己的课程
//     if (user.roleId === 2) { // 假设 roleId=2 是教师
//       createCourseDto.teacherId = user.id;
//     }
    
//     return this.courseRepository.create(createCourseDto);
//   }

//   // 更新课程
//   async update(id: number, updateCourseDto: UpdateCourseDto, user: User) {
//     const ability = await this.caslFactory.defineAbility(user);
//     const course = await this.courseRepository.findById(id);
    
//     // 检查权限
//     if (!ability.can(Action.Update, course)) {
//       throw new ForbiddenException('无权限更新此课程');
//     }
    
//     return this.courseRepository.update(id, updateCourseDto);
//   }

//   // 获取课程列表
//   async findAll(user: User) {
//     const ability = await this.caslFactory.defineAbility(user);
    
//     // 管理员可以查看所有课程
//     if (ability.can(Action.Read, SubjectsEnum.Course)) {
//       if (user.roleId === 1) { // 管理员
//         return this.courseRepository.findAll();
//       } 
//       // 教师只能查看自己的课程
//       else if (user.roleId === 2) {
//         return this.courseRepository.findByTeacherId(user.id);
//       }
//       // 学生和家长只能查看所在班级的课程
//       else {
//         const classId = user.roleId === 3 ? user.classId : [1, 2]; // 示例
//         return this.courseRepository.findByClassId(classId);
//       }
//     }
    
//     throw new ForbiddenException('无权限查看课程');
//   }
// }