import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未授权访问');
    }

    const taskId = parseInt((await params).id);
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    // 验证任务是否存在且用户是发布者
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        authorId: user.id
      },
      include: {
        assignment: true
      }
    });

    if (!task) {
      return ResponseUtil.notFound('任务不存在或您不是发布者');
    }

    if (task.status !== 'ADMIN_CONFIRMED') {
      return ResponseUtil.error('任务状态不允许确认完成');
    }

    if (task.noNeedMeConfirmed) {
      return ResponseUtil.error('该任务无需发布者确认');
    }

    // 更新任务状态为发布者已确认
    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status: 'PUBLISHER_CONFIRMED'
      }
    });

    return ResponseUtil.success('任务确认完成成功');
  } catch (error) {
    console.error('确认任务完成失败:', error);
    return ResponseUtil.serverError('确认任务完成失败');
  }
} 