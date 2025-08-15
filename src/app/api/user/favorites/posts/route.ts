import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 获取用户收藏的帖子列表
export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const userId = user.id;

    // 获取用户收藏的帖子
    const favoritePosts = await prisma.forumPostFavorite.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
            section: {
              select: {
                id: true,
                name: true,
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
    const formattedPosts = favoritePosts.map(favorite => ({
      id: favorite.post.id,
      title: favorite.post.title,
      content: favorite.post.content,
      viewCount: favorite.post.viewCount,
      commentCount: favorite.post.commentCount,
      likeCount: favorite.post.likeCount,
      createdAt: favorite.post.createdAt,
      author: favorite.post.author,
      section: favorite.post.section,
    }));

    return ResponseUtil.success(formattedPosts);
  } catch (error) {
    console.error('获取收藏帖子失败:', error);
    return ResponseUtil.serverError('获取收藏帖子失败');
  }
} 