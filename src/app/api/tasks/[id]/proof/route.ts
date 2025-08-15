import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params:Promise< { id: string }> }
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

    // 获取任务及其分配信息
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        OR: [
          { authorId: user.id }, // 任务发布者
          { assignment: { assigneeId: user.id } } // 任务接单者
        ]
      },
      include: {
        assignment: {
          include: {
            assignee: {
              select: {
                id: true,
                nickname: true,
                avatar: true
              }
            }
          }
        },
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });

    if (!task) {
      return ResponseUtil.notFound('任务不存在或您无权查看');
    }

    if (!task.assignment) {
      return ResponseUtil.error('任务尚未分配');
    }

    return ResponseUtil.success({
      task: {
        id: task.id,
        title: task.title,
        status: task.status
      },
      assignment: {
        id: task.assignment.id,
        assignedAt: task.assignment.assignedAt,
        proof: task.assignment.proof,
        fileUrls: task.assignment.fileUrls,
        assignee: task.assignment.assignee
      }
    });
  } catch (error) {
    console.error('获取任务证明失败:', error);
    return ResponseUtil.serverError('获取任务证明失败');
  }
} 