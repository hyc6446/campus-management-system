import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // 清空数据，注意顺序避免外键约束错误
  await prisma.$transaction([
    prisma.token.deleteMany(),
    // prisma.auditLog.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  console.log('✅ 清空现有数据');

  // 创建角色
  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN' }
  });
  const teacherRole = await prisma.role.create({
    data: { name: 'TEACHER' }
  });
  const studentRole = await prisma.role.create({
    data: { name: 'STUDENT' }
  });
  const parentRole = await prisma.role.create({
    data: { name: 'PARENT' }
  });
  
  console.log('✅ 创建角色');

  // 创建管理员用户
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@campus.com',
      password: adminPassword,
      userName: '系统管理员',
      roleId: adminRole.id
    }
  });

  console.log('✅ 创建管理员用户:', admin.email);

  // 创建权限 - 为不同角色分配不同权限
  // 管理员权限
  await prisma.permission.create({
    data: {
      action: 'manage',
      subject: 'all',
      roleId: adminRole.id,
    },
  });
  
  // 教师权限
  await Promise.all([
    { action: 'read', subject: 'User' },
    { action: 'read', subject: 'Course' },
    { action: 'read', subject: 'Score' },
    { action: 'read', subject: 'Attendance' },

  ].map(perm => prisma.permission.create({
    data: { ...perm, roleId: teacherRole.id }
  })));
  
  // 学生权限
  await Promise.all([
    { action: 'read', subject: 'Student' },
    { action: 'read', subject: 'Course' },
    { action: 'read', subject: 'Score' },
    { action: 'read', subject: 'Attendance' },
    { action: 'read', subject: 'Notice' },
  ].map(perm => prisma.permission.create({
    data: { ...perm, roleId: studentRole.id }
  })));
  
  // 家长权限（与学生类似但可能有区别）
  await Promise.all([
    { action: 'read', subject: 'Student' },
    { action: 'read', subject: 'Score' },
    { action: 'read', subject: 'Attendance' },
    { action: 'read', subject: 'Notice' },
  ].map(perm => prisma.permission.create({
    data: { ...perm, roleId: parentRole.id }
  })));

  console.log('✅ 创建权限');

  // 创建测试用户
  const testUsers = [
    {
      id:0,
      email: 'anonymous@example.com',
      password: '111111',
      userName: '默认账户',
      roleId: adminRole.id,
    },
    {
      email: 'teacher@campus.com',
      password: 'teacher123',
      userName: '张老师',
      roleId: teacherRole.id,
    },
    {
      email: 'student@campus.com',
      password: 'student123',
      userName: '李学生',
      roleId: studentRole.id,
    },
    {
      email: 'parent@campus.com',
      password: 'parent123',
      userName: '王家长',
      roleId: parentRole.id,
    },
  ];

  for (const user of testUsers) {
    const hashedPassword = await hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
    console.log(`✅ 创建测试用户: ${user.email}`);
  }

  console.log('🎉 数据种子完成!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });