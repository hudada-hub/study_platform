import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sectionId = parseInt(id);
    
    if (isNaN(sectionId)) {
      return ResponseUtil.serverError('无效的板块ID');
    }

    // 查询板块详情，包含关联的分类和版主信息
    const section = await prisma.forumSection.findUnique({
      where: { id: sectionId },
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
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            postCount: true,
          },
        },
        _count: {
          select: {
            posts: true,
            favorites: true,
          },
        },
      },
    });

    if (!section) {
      return ResponseUtil.error('板块不存在', 404);
    }

    // 处理数据格式
    const formattedSection = {
      id: section.id,
      name: section.name,
      description: section.description,
      coverUrl: section.coverUrl,
      categoryId: section.categoryId,
      category: section.category,
      moderatorId: section.moderatorId,
      moderator: section.moderator,
      createdAt: section.createdAt.toISOString(),
      lastPostAt: section.lastPostAt.toISOString(),
      postCount: section.postCount,
      sort: section.sort,
      parentId: section.parentId,
      parent: section.parent,
      children: section.children,
      announcement: section.announcement,
      favoriteCount: section.favoriteCount,
      updatedAt: section.updatedAt.toISOString(),
    };

    return ResponseUtil.success(formattedSection);
  } catch (error) {
    console.error('获取板块详情失败:', error);
    return ResponseUtil.error('获取板块详情失败', 500);
  }
} 