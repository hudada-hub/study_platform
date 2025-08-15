import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    // 获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    // 检查任务是否存在
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        isDeleted: false,
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在');
    }

    // 检查是否已经收藏
    const existingFavorite = await prisma.taskFavorite.findFirst({
      where: {
        taskId,
        userId: user.id,
      },
    });

    let hasFavorited: boolean;
    let favoriteCount: number;

    if (existingFavorite) {
      // 取消收藏
      await prisma.taskFavorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      hasFavorited = false;
    } else {
      // 添加收藏
      await prisma.taskFavorite.create({
        data: {
          taskId,
          userId: user.id,
        },
      });
      hasFavorited = true;
    }

    // 获取最新收藏数
    favoriteCount = await prisma.taskFavorite.count({
      where: {
        taskId,
      },
    });

    return ResponseUtil.success({
      hasFavorited,
      favoriteCount,
    });
  } catch (error) {
    console.error('任务收藏失败:', error);
    return ResponseUtil.error('任务收藏失败');
  }
} 