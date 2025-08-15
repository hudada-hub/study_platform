import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { UserStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // 获取用户总数
    const userCount = await prisma.user.count({
      where: {
        status: UserStatus.ACTIVE,
      },
    });

    // 获取课程总数
    const courseCount = await prisma.course.count({
      where: {
        isDeleted: false,
      },
    });

    // 获取任务总数
    const taskCount = await prisma.task.count({
      where: {
        isDeleted: false,
      },
    });

    // 获取帖子总数
    const postCount = await prisma.forumPost.count({
      where: {
        isDeleted: false,
      },
    });

    return ResponseUtil.success({
      userCount,
      courseCount,
      taskCount,
      postCount,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return ResponseUtil.error('获取统计数据失败');
  }
} 