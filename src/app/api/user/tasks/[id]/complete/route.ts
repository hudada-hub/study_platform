import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const { id } = await params;
    const taskId = parseInt(id);
    if (!taskId) {
      return ResponseUtil.error('任务ID无效');
    }

    const body = await request.json();
    const { proof } = body;

    if (!proof || !proof.trim()) {
      return ResponseUtil.error('请填写完成证明');
    }

    // 检查任务是否存在且用户是否被分配
    const assignment = await prisma.taskAssignment.findFirst({
      where: {
        taskId: taskId,
        assigneeId: user.id,
      },
      include: {
        task: true,
      },
    });

    if (!assignment) {
      return ResponseUtil.error('您没有权限提交此任务的完成证明');
    }

    if (assignment.task.status !== 'IN_PROGRESS') {
      return ResponseUtil.error('任务状态不允许提交完成证明');
    }

    // 更新任务分配记录和任务状态
    const result = await prisma.$transaction(async (tx) => {
      // 更新分配记录
      const updatedAssignment = await tx.taskAssignment.update({
        where: { id: assignment.id },
        data: {
          proof: proof.trim(),
        },
      });

      // 更新任务状态为已完成
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      return { assignment: updatedAssignment, task: updatedTask };
    });

    return ResponseUtil.success(result, '完成证明提交成功');
  } catch (error) {
    console.error('提交完成证明失败:', error);
    return ResponseUtil.error('提交完成证明失败');
  }
} 