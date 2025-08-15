import { PrismaClient } from '@prisma/client'

// 声明全局变量类型
declare global {
  var prisma: PrismaClient | undefined;
}

// 创建 Prisma 客户端单例
const prisma = global.prisma || new PrismaClient()

// 在开发环境中将 prisma 实例保存到全局变量中
if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma