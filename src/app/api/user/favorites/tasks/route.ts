import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 查询用户收藏的任务
    const [favorites, total] = await Promise.all([
      prisma.taskFavorite.findMany({
        where: {
          userId: user.id,
        },
        include: {
          task: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
              author: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              _count: {
                select: {
                  likes: true,
                  favorites: true,
                  applications: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.taskFavorite.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    // 处理数据，添加点赞和收藏状态
    const tasks = favorites.map(favorite => ({
      ...favorite.task,
      likeCount: favorite.task._count.likes,
      favoriteCount: favorite.task._count.favorites,
      applicationCount: favorite.task._count.applications,
      hasLiked: false, // 这里需要根据当前用户判断，暂时设为false
      hasFavorited: true, // 用户已收藏
      favoritedAt: favorite.createdAt,
    }));

    return ResponseUtil.success({
      items: tasks,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取收藏任务失败:', error);
    return ResponseUtil.error('获取收藏任务失败');
  }
} 