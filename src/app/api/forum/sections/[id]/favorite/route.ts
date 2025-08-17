import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 添加收藏
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
        const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const {id} = await params;
    const sectionId = parseInt(id);
    const userId = user.id;

    // 检查板块是否存在
    const section = await prisma.forumSection.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      return ResponseUtil.error('板块不存在', 404);
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.forumSectionFavorite.findUnique({
      where: {
        userId_sectionId: {
          userId,
          sectionId,
        },
      },
    });

    if (existingFavorite) {
      return ResponseUtil.badRequest('已经收藏过该板块');
    }

    // 创建收藏记录
    await prisma.forumSectionFavorite.create({
      data: {
        userId,
        sectionId,
      },
    });

    // 更新板块收藏数
    await prisma.forumSection.update({
      where: { id: sectionId },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return ResponseUtil.success('收藏成功');
  } catch (error) {
    console.error('添加收藏失败:', error);
    return ResponseUtil.error('收藏失败', 500);
  }
}

// 取消收藏
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const {id} = await params;
    const sectionId = parseInt(id);
    const userId = user.id;

    // 删除收藏记录
    const deletedFavorite = await prisma.forumSectionFavorite.delete({
      where: {
        userId_sectionId: {
          userId,
          sectionId,
        },
      },
    });

    if (!deletedFavorite) {
      return ResponseUtil.error('未找到收藏记录', 404);
    }

    // 更新板块收藏数
    await prisma.forumSection.update({
      where: { id: sectionId },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    return ResponseUtil.success('取消收藏成功');
  } catch (error) {
    console.error('取消收藏失败:', error);
    return ResponseUtil.error('取消收藏失败', 500);
  }
} 