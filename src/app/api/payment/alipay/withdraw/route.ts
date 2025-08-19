import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { WithdrawService } from '@/services/withdrawService';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const authResult = await verifyAuth(request);
    if (!authResult?.user?.id) {
      return ResponseUtil.unauthorized('未登录');
    }

    const { taskId, amount, accountType, accountInfo } = await request.json();

    // 验证参数
    if (!taskId || !amount || !accountType || !accountInfo) {
      return ResponseUtil.badRequest('参数不完整');
    }

    if (amount <= 0) {
      return ResponseUtil.badRequest('提现金额必须大于0');
    }

    // 验证任务是否存在且属于当前用户
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { assignment: true }
    });

    if (!task) {
      return ResponseUtil.badRequest('任务不存在');
    }

    if (task.authorId !== authResult.user.id) {
      return ResponseUtil.forbidden('只能提现自己的任务奖励');
    }

    if (task.status !== 'ADMIN_CONFIRMED') {
      return ResponseUtil.badRequest('任务状态不正确，无法提现');
    }

    // 检查用户是否有足够的积分
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id }
    });

    if (!user || user.withDrawPoints < amount) {
      return ResponseUtil.badRequest('可提现积分不足');
    }

    // 创建提现记录
    await WithdrawService.createWithdrawRecord(taskId, authResult.user.id, amount, accountInfo);

    // 扣除用户积分
    await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        withDrawPoints: {
          decrement: amount
        }
      }
    });

    // 调用支付宝提现服务
    const withdrawResult = await WithdrawService.processAlipayWithdraw({
      taskId,
      amount,
      accountType,
      accountInfo
    });

    return ResponseUtil.success({
      message: '提现申请提交成功',
      data: {
        withdrawId: withdrawResult.withdrawId,
        amount: withdrawResult.amount,
        fee: withdrawResult.fee,
        status: withdrawResult.status
      }
    });

  } catch (error) {
    console.error('提现处理失败:', error);
    return ResponseUtil.serverError('提现处理失败: ' + (error as Error).message);
  }
}

// 查询提现状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const withdrawId = searchParams.get('withdrawId');

    if (!withdrawId) {
      return ResponseUtil.error('缺少提现ID');
    }

    // 暂时注释掉，等Prisma生成完成
    // const withdrawRecord = await prisma.withdrawRecord.findUnique({
    //   where: { id: parseInt(withdrawId) }
    // });

    // if (!withdrawRecord) {
    //   return ResponseUtil.error('提现记录不存在');
    // }

    // return ResponseUtil.success(withdrawRecord);
    return ResponseUtil.success({ message: '提现状态查询功能待完善' });

  } catch (error) {
    console.error('查询提现状态失败:', error);
    return ResponseUtil.error('查询提现状态失败');
  }
} 