import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    // 先查询所有论坛分类
    const categories = await prisma.forumCategory.findMany({
      include: {
        sections: {
          where: {
            parentId: null, // 只查询一级板块
          },
          include: {
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
              },
            },
            _count: {
              select: {
                posts: true,
                favorites: true,
              },
            },
          },
          orderBy: [
            { sort: 'desc' },
            { postCount: 'desc' },
            { createdAt: 'desc' },
          ],
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    // 构建树形结构数据
    const treeData = categories.map(category => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
      sections: category.sections.map(section => ({
        id: section.id,
        name: section.name,
        description: section.description,
        coverUrl: section.coverUrl,
        categoryId: section.categoryId,
        category: {
          id: category.id,
          name: category.name,
        },
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
      })),
    }));

    return ResponseUtil.success(treeData);
  } catch (error) {
    console.error('获取论坛板块失败:', error);
    return ResponseUtil.error('获取论坛板块失败', 500);
  }
} 