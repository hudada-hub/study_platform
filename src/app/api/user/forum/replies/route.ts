import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录', 401);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // 获取用户回复总数
    const total = await prisma.forumComment.count({
      where: {
        authorId: user.id,
      },
    });

    // 获取用户回复列表
    const replies = await prisma.forumComment.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        post: {
          include: {
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
      skip,
      take: pageSize,
    });

    // 处理数据格式
    const formattedReplies = replies.map(reply => ({
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      post: {
        id: reply.post.id,
        title: reply.post.title,
        section: reply.post.section,
      },
    }));

    return ResponseUtil.success({
      replies: formattedReplies,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('获取用户回复列表失败:', error);
    return ResponseUtil.error('获取用户回复列表失败');
  }
} 