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
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const { id } = await params;
    const postId = parseInt(id);
    const userId = user.id;

    // 检查帖子是否存在
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在');
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.forumPostFavorite.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingFavorite) {
      return ResponseUtil.serverError('已经收藏过该帖子');
    }

    // 创建收藏记录
    await prisma.forumPostFavorite.create({
      data: {
        userId,
        postId,
      },
    });

    return ResponseUtil.success('收藏成功');
  } catch (error) {
    console.error('添加收藏失败:', error);
    return ResponseUtil.serverError('收藏失败');
  }
}

// 取消收藏
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const { id } = await params;
    const postId = parseInt(id);
    const userId = user.id;

    // 删除收藏记录
    const deletedFavorite = await prisma.forumPostFavorite.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!deletedFavorite) {
      return ResponseUtil.serverError('未找到收藏记录');
    }

    return ResponseUtil.success('取消收藏成功');
  } catch (error) {
    console.error('取消收藏失败:', error);
    return ResponseUtil.serverError('取消收藏失败');
  }
} 