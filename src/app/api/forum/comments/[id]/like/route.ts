import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 点赞评论
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
    const commentId = parseInt(id);
    const userId = user.id;

    // 检查评论是否存在
    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return ResponseUtil.serverError('评论不存在');
    }

    // 检查是否已经点赞
    const existingLike = await prisma.forumCommentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existingLike) {
      return ResponseUtil.serverError('已经点赞过该评论');
    }

    // 创建点赞记录
    await prisma.forumCommentLike.create({
      data: { userId, commentId },
    });

    // 更新评论点赞数
    await prisma.forumComment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    });

    return ResponseUtil.success('点赞成功');
  } catch (error) {
    console.error('点赞失败:', error);
    return ResponseUtil.serverError('点赞失败');
  }
}

// 取消点赞
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
    const commentId = parseInt(id);
    const userId = user.id;

    // 删除点赞记录
    await prisma.forumCommentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });

    // 更新评论点赞数
    await prisma.forumComment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    });

    return ResponseUtil.success('取消点赞成功');
  } catch (error) {
    console.error('取消点赞失败:', error);
    return ResponseUtil.serverError('取消点赞失败');
  }
} 