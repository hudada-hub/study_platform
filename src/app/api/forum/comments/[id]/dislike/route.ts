import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 反对评论
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

    // 检查是否已经反对
    const existingDislike = await prisma.forumCommentDislike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    if (existingDislike) {
      return ResponseUtil.badRequest('已经反对过该评论');
    }

    // 创建反对记录
    await prisma.forumCommentDislike.create({
      data: { userId, commentId },
    });

    // 更新评论反对数
    await prisma.forumComment.update({
      where: { id: commentId },
      data: { dislikeCount: { increment: 1 } },
    });

    return ResponseUtil.success('反对成功');
  } catch (error) {
    console.error('反对失败:', error);
    return ResponseUtil.serverError('反对失败');
  }
}

// 取消反对
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

    // 删除反对记录
    await prisma.forumCommentDislike.delete({
      where: { userId_commentId: { userId, commentId } },
    });

    // 更新评论反对数
    await prisma.forumComment.update({
      where: { id: commentId },
      data: { dislikeCount: { decrement: 1 } },
    });

    return ResponseUtil.success('取消反对成功');
  } catch (error) {
    console.error('取消反对失败:', error);
    return ResponseUtil.serverError('取消反对失败');
  }
} 