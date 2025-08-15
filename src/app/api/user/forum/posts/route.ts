import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 获取用户帖子列表
export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const userId = user.id;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const status = searchParams.get('status');

    // 构建查询条件
    const where: any = {
      authorId: userId,
    };

    // 如果指定了状态筛选
    if (status && status !== 'all') {
      where.status = status;
    }

    // 获取总数
    const total = await prisma.forumPost.count({
      where,
    });

    // 获取帖子列表
    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 格式化数据
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      viewCount: post.viewCount,
      commentCount: post.commentCount,
      likeCount: post.likeCount,
      createdAt: post.createdAt,
      status: post.status,
      section: post.section,
    }));

    return ResponseUtil.success({
      posts: formattedPosts,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取用户帖子失败:', error);
    return ResponseUtil.serverError('获取用户帖子失败');
  }
} 