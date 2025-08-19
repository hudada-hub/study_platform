import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return ResponseUtil.unauthorized('未登录');
    }

    const {user} = await verifyAuth(request);
    if (user?.role !== 'ADMIN') {
      return ResponseUtil.unauthorized('无权限');
    }

    const { userId, points, ratio, reason } = await request.json();

    // 验证参数
    if (!userId || !points || !ratio) {
      return ResponseUtil.badRequest('参数不完整');
    }

    if (ratio < 0.8 || ratio > 1.0) {
      return ResponseUtil.badRequest('比例必须在80%-100%之间');
    }

    if (points <= 0) {
      return ResponseUtil.badRequest('积分数量必须大于0');
    }

    // 计算实际发放积分
    const actualPoints = Math.floor(points * ratio);

    // 开启事务
    const result = await prisma.$transaction(async (tx) => {
      // 更新用户积分
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          withDrawPoints: {
            increment: actualPoints
          }
        }
      });

      // 创建发放记录
      const record = await tx.userWithdrawRecord.create({
        data: {
          userId,
          withdrawNo: `GRANT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: actualPoints,
          status: 'COMPLETED',
          accountInfo: { type: 'ADMIN_GRANT', reason, adminId: user?.id },
          processedAt: new Date(),
          completedAt: new Date()
        }
      });

      return { user: updatedUser, record };
    });

    return ResponseUtil.success({
      message: '积分发放成功',
      data: {
        userId,
        originalPoints: points,
        actualPoints,
        ratio,
        newBalance: result.user.withDrawPoints
      }
    });

  } catch (error) {
    console.error('发放积分失败:', error);
    return ResponseUtil.serverError('发放积分失败');
  }
} 