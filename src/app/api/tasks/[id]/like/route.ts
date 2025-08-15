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

    // 检查是否已经点赞
    const existingLike = await prisma.taskLike.findFirst({
      where: {
        taskId,
        userId: user.id,
      },
    });

    let hasLiked: boolean;
    let likeCount: number;

    if (existingLike) {
      // 取消点赞
      await prisma.taskLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      hasLiked = false;
    } else {
      // 添加点赞
      await prisma.taskLike.create({
        data: {
          taskId,
          userId: user.id,
        },
      });
      hasLiked = true;
    }

    // 获取最新点赞数
    likeCount = await prisma.taskLike.count({
      where: {
        taskId,
      },
    });

    return ResponseUtil.success({
      hasLiked,
      likeCount,
    });
  } catch (error) {
    console.error('任务点赞失败:', error);
    return ResponseUtil.error('任务点赞失败');
  }
} 