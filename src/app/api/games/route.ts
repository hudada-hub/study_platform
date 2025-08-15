import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const {user} = await verifyAuth(request);

    // 获取所有活跃的游戏
    const games = await prisma.game.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 如果用户已登录，获取用户的报名状态
    let userRegistrations: any[] = [];
    if (user) {
      userRegistrations = await prisma.gameRegistration.findMany({
        where: {
          userId: user.id
        },
        select: {
          gameId: true,
          status: true,
          registeredAt: true
        }
      });
    }

    // 为每个游戏添加用户的报名状态
    const gamesWithRegistration = games.map(game => {
      const registration = userRegistrations.find(r => r.gameId === game.id);
      return {
        ...game,
        userRegistration: registration || null
      };
    });

    return ResponseUtil.success(gamesWithRegistration);

  } catch (error) {
    console.error('获取游戏列表失败:', error);
    return ResponseUtil.error('获取游戏列表失败');
  }
} 