import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 举报评论
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
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return ResponseUtil.serverError('举报内容不能为空');
    }

    // 检查评论是否存在
    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return ResponseUtil.serverError('评论不存在');
    }

    // 检查是否已经举报过
    const existingReport = await prisma.forumCommentReport.findFirst({
      where: { userId, commentId },
    });

    if (existingReport) {
      return ResponseUtil.serverError('已经举报过该评论');
    }

    // 创建举报记录
    await prisma.forumCommentReport.create({
      data: {
        userId,
        commentId,
        content: content.trim(),
      },
    });

    return ResponseUtil.success('举报成功');
  } catch (error) {
    console.error('举报失败:', error);
    return ResponseUtil.serverError('举报失败');
  }
} 