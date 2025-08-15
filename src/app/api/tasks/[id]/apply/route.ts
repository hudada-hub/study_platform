import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function POST(
  request: NextRequest,
  { params }: { params:Promise<{id:string}> }
) {
  try {
    const {id} = await params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    // 获取当前用户
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const contentType = request.headers.get('content-type') || '';
    let reason: string;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      reason = formData.get('reason') as string;
    } else {
      const body = await request.json();
      reason = body.reason;
    }

    if (!reason || !reason.trim()) {
      return ResponseUtil.error('请填写报名理由');
    }

    // 检查任务是否存在且状态正确
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        isDeleted: false,
        isHidden: false,
        status: 'APPROVED',
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在');
    }

    if (task.status !== 'APPROVED') {
      return ResponseUtil.error('该任务暂不接受报名');
    }

    // 检查是否是自己的任务
    if (task.authorId === user.id) {
      return ResponseUtil.error('不能报名自己发布的任务');
    }

    // 先检查是否已存在报名记录
    const existingApplication = await prisma.taskApplication.findFirst({
      where: {
        taskId,
        applicantId: user.id,
      },
    });

    if (existingApplication) {
      // 如果已存在，则更新
      await prisma.taskApplication.update({
        where: { id: existingApplication.id },
        data: {
          reason: reason,
          createdAt: new Date(), // 更新报名时间
        },
      });
    } else {
      // 如果不存在，则创建
      await prisma.taskApplication.create({
        data: {
          taskId,
          applicantId: user.id,
          reason: reason,
        },
      });
    }

    return ResponseUtil.success('报名成功');
  } catch (error) {
    console.error('报名任务失败:', error);
    return ResponseUtil.error('报名失败');
  }
} 