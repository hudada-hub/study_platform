import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);
    
    if (isNaN(commentId)) {
      return ResponseUtil.error('无效的评论ID');
    }

    // 获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    // 检查评论是否存在
    const comment = await prisma.taskComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return ResponseUtil.error('评论不存在');
    }

    // 检查是否已经点赞
    const existingLike = await prisma.taskCommentLike.findFirst({
      where: {
        commentId,
        userId: user.id,
      },
    });

    let hasLiked: boolean;
    let likesCount: number;

    if (existingLike) {
      // 取消点赞
      await prisma.taskCommentLike.delete({
        where: { id: existingLike.id },
      });
      hasLiked = false;
    } else {
      // 添加点赞
      await prisma.taskCommentLike.create({
        data: {
          commentId,
          userId: user.id,
        },
      });
      hasLiked = true;
    }

    // 获取最新的点赞数量
    likesCount = await prisma.taskCommentLike.count({
      where: { commentId },
    });

    return ResponseUtil.success({
      hasLiked,
      likesCount,
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return ResponseUtil.error('点赞失败');
  }
} 