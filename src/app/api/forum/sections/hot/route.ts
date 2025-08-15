import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    // 查询热门板块：postCount从高到低排序，parentId为null，限制5个
    const hotSections = await prisma.forumSection.findMany({
      where: {
        parentId: null, // 只查询顶级板块
      },
      orderBy: {
        postCount: 'desc', // 按帖子数量从高到低排序
      },
      take: 5, // 限制5个
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        moderator: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    // 处理数据格式
    const formattedSections = hotSections.map(section => ({
      id: section.id,
      name: section.name,
      description: section.description,
      postCount: section.postCount,
      favoriteCount: section.favoriteCount,
      category: section.category,
      moderator: section.moderator,
      coverUrl: section.coverUrl,
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
    }));

    return ResponseUtil.success({
      sections: formattedSections,
    });
  } catch (error) {
    console.error('获取热门板块失败:', error);
    return ResponseUtil.error('获取热门板块失败');
  }
} 