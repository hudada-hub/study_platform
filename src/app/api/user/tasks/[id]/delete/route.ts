import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function DELETE(
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

    // 检查任务是否存在且用户是否有权限删除
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        authorId: user.id,
        isDeleted: false,
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在或您没有权限删除');
    }

    // 检查任务状态，确定是否可以删除
    const now = new Date();
    const taskCreatedAt = new Date(task.createdAt);
    const timeDiff = now.getTime() - taskCreatedAt.getTime();
    const tenMinutes = 10 * 60 * 1000; // 10分钟的毫秒数

    let refundAmount = 0;
    let canDelete = false;
    let message = '';

    switch (task.status) {
      case 'PENDING':
        if (timeDiff <= tenMinutes) {
          // 10分钟内删除，全额返还
          refundAmount = task.points;
          canDelete = true;
          message = '任务删除成功，积分已全额返还';
        } else {
          // 超过10分钟，扣除10%
          refundAmount = Math.floor(task.points * 0.9);
          canDelete = true;
          message = '任务删除成功，扣除10%手续费，剩余积分已返还';
        }
        break;

      case 'APPROVED':
        // 已通过状态，扣除10%
        refundAmount = Math.floor(task.points * 0.9);
        canDelete = true;
        message = '任务删除成功，扣除10%手续费，剩余积分已返还';
        break;

      case 'REJECTED':
        // 已拒绝状态，全额返还
        refundAmount = task.points;
        canDelete = true;
        message = '任务删除成功，积分已全额返还';
        break;

      case 'IN_PROGRESS':
      case 'COMPLETED':
      case 'ADMIN_CONFIRMED':
      case 'PUBLISHER_CONFIRMED':
        return ResponseUtil.error('任务正在执行中或已完成，无法删除');

      default:
        return ResponseUtil.error('任务状态异常，无法删除');
    }

    if (!canDelete) {
      return ResponseUtil.error('当前任务状态不允许删除');
    }

    // 使用事务执行删除和积分返还
    const result = await prisma.$transaction(async (tx) => {
      // 标记任务为已删除
      const deletedTask = await tx.task.update({
        where: { id: taskId },
        data: { isDeleted: true },
      });

      // 返还积分给用户
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { points: { increment: refundAmount } },
      });

      // 生成退款订单
      const refundOrder = await tx.order.create({
        data: {
          orderNo: `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'TASK',
          title: `任务删除退款 - ${task.title}`,
          amount: new Decimal(refundAmount),
          status: 'PAID',
          paymentMethod: 'BALANCE',
          userId: user.id,
          taskId: taskId,
          remark: `任务删除退款，原任务：${task.title}`,
          expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return { deletedTask, updatedUser, refundOrder };
    });

    return ResponseUtil.success(result, message);
  } catch (error) {
    console.error('删除任务失败:', error);
    return ResponseUtil.error('删除任务失败');
  }
} 