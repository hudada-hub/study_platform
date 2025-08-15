import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);
    
    if (isNaN(commentId)) {
      return ResponseUtil.serverError('无效的评论ID');
    }

    // 验证评论是否存在
    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return ResponseUtil.serverError('评论不存在');
    }

    // 增加点赞数
    const updatedComment = await prisma.forumComment.update({
      where: { id: commentId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    return ResponseUtil.success({
      id: updatedComment.id,
      likeCount: updatedComment.likeCount,
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return ResponseUtil.error('点赞失败', 500);
  }
} 