import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('请先登录');
    }

    const userId = user.id;
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '10');

    const [total, favorites] = await Promise.all([
      prisma.courseFavorite.count({
        where: { userId }
      }),
      prisma.courseFavorite.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              _count: {
                select: {
                  favorites: true,
                  likes: true,
                  comments: true,
                }
              },
              chapters: {
                select: {
                  id: true,
                  title: true,
                  videoUrl: true,
                }
              }
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    const courses = favorites.map(favorite => ({
      ...favorite.course,
      favoriteCount: favorite.course._count.favorites,
      likeCount: favorite.course._count.likes,
      commentCount: favorite.course._count.comments,
      isFavorited: true,
    }));

    return ResponseUtil.success({
      items: courses,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取收藏课程失败:', error);
    return ResponseUtil.error('获取收藏课程失败');
  }
} 