import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const body = await request.json();
    const { gameId } = body;

    if (!gameId) {
      return ResponseUtil.serverError('游戏ID不能为空');
    }

    // 检查游戏是否存在且活跃
    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        status: 'ACTIVE'
      }
    });

    if (!game) {
      return ResponseUtil.serverError('游戏不存在或已下架');
    }

    // 检查用户是否已经报名
    const existingRegistration = await prisma.gameRegistration.findFirst({
      where: {
        userId: user.id,
        gameId: gameId
      }
    });

    if (existingRegistration) {
      return ResponseUtil.serverError('您已经报名过此游戏');
    }

    // 创建报名记录
    const registration = await prisma.gameRegistration.create({
      data: {
        userId: user.id,
        gameId: gameId,
        status: 'REGISTERED',
        registeredAt: new Date()
      }
    });

    return ResponseUtil.success({
      message: '报名成功',
      data: registration
    });

  } catch (error) {
    console.error('游戏报名失败:', error);
    return ResponseUtil.serverError('报名失败，请重试');
  }
} 