import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    // 获取最多20个阅读量最高的帖子
    const topPosts = await prisma.forumPost.findMany({
      where: {
        status: {
          in: ['PUBLISHED', 'PENDING'] // 获取已发布或未审核状态的帖子
        },
        isDeleted: false,    // 不获取已删除的帖子
      },
      select: {
        id: true,
        title: true,
        viewCount: true,
        commentCount: true,
        createdAt: true,
        coverUrl: true,
        likeCount: true,
        section: {
          select: {
            id: true,
            name: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        viewCount: 'desc', // 按阅读量降序排列
      },
      take: 20, // 最多获取20个
    });

    return ResponseUtil.success(topPosts);
  } catch (error) {
    console.error('获取论坛排行榜失败:', error);
    return ResponseUtil.error('获取排行榜失败');
  }
} 