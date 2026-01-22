// // src/modules/score/score.service.ts
// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { CaslFactory } from '@core/casl/casl.factory';
// import { User } from '@modules/user/entities/user.entity';
// import { Action, SubjectsEnum } from '@core/casl/casl.types';
// import { ScoreRepository } from './repositories/score.repository';

// @Injectable()
// export class ScoreService {
//   constructor(
//     private scoreRepository: ScoreRepository,
//     private caslFactory: CaslFactory
//   ) {}

//   // 获取成绩
//   async getScore(studentId: number, courseId: number, user: User) {
//     const ability = await this.caslFactory.defineAbility(user);
//     const score = await this.scoreRepository.findByStudentAndCourse(studentId, courseId);
    
//     // 检查权限
//     if (!ability.can(Action.Read, score)) {
//       throw new ForbiddenException('无权限查看此成绩');
//     }
    
//     return score;
//   }

//   // 更新成绩
//   async updateScore(studentId: number, courseId: number, score: number, user: User) {
//     const ability = await this.caslFactory.defineAbility(user);
//     const existingScore = await this.scoreRepository.findByStudentAndCourse(studentId, courseId);
    
//     // 检查权限
//     if (!ability.can(Action.Update, existingScore)) {
//       throw new ForbiddenException('无权限更新此成绩');
//     }
    
//     return this.scoreRepository.update(studentId, courseId, { score });
//   }
// }