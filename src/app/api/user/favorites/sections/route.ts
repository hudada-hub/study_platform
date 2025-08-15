import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 获取用户收藏的板块列表
export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const userId = user.id;

    // 获取用户收藏的板块
    const favoriteSections = await prisma.forumSectionFavorite.findMany({
      where: {
        userId,
      },
      include: {
        section: {
          include: {
            moderator: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 格式化数据
    const formattedSections = favoriteSections.map(favorite => ({
      id: favorite.section.id,
      name: favorite.section.name,
      description: favorite.section.description,
      postCount: favorite.section.postCount,
      favoriteCount: favorite.section.favoriteCount,
      createdAt: favorite.section.createdAt,
      moderator: favorite.section.moderator,
    }));

    return ResponseUtil.success(formattedSections);
  } catch (error) {
    console.error('获取收藏板块失败:', error);
    return ResponseUtil.serverError('获取收藏板块失败');
  }
} 