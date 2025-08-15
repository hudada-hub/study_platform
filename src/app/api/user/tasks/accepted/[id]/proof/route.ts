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

    const body = await request.json();
    const { proof, fileUrls } = body;

    if (!proof) {
      return ResponseUtil.error('证明内容不能为空');
    }

    // 验证任务是否存在且用户已接受
    const task = await prisma.task.findFirst({
              where: {
          id: taskId,
          assignment: {
            assignee: {
              id: user.id
            }
          }
        },
      include: {
        assignment: true
      }
    });

    if (!task) {
      return ResponseUtil.notFound('任务不存在或您未接受此任务');
    }

    if (task.status !== 'IN_PROGRESS') {
      return ResponseUtil.error('任务状态不允许提交证明');
    }

    // 更新任务分配记录
    await prisma.taskAssignment.update({
      where: {
        taskId: taskId
      },
      data: {
        proof: proof,
        fileUrls: fileUrls || []
      }
    });

    // 更新任务状态为已完成
    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        status: 'COMPLETED'
      }
    });

    return ResponseUtil.success('证明提交成功');
  } catch (error) {
    console.error('提交证明失败:', error);
    return ResponseUtil.serverError('提交证明失败');
  }
} 