import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { PostStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = decodeURIComponent(searchParams.get('keyword') || '');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!keyword || keyword.trim() === '') {
      return ResponseUtil.success({
        list: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      });
    }

    // 构建搜索条件
    const where = {
      status: PostStatus.PUBLISHED,
      OR: [
        {
          title: {
            contains: keyword.trim(),
          },
        },
        {
          content: {
            contains: keyword.trim(),
          },
        },
      ],
    };

    // 获取总数
    const total = await prisma.forumPost.count({ where });

    // 获取分页数据
    const posts = await prisma.forumPost.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return ResponseUtil.success({
      list: posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('搜索帖子失败:', error);
    return ResponseUtil.error('搜索失败');
  }
} 