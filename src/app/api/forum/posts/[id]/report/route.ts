import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 举报帖子
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

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return ResponseUtil.serverError('举报内容不能为空');
    }

    // 检查帖子是否存在
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在');
    }

    // 检查是否已经举报过
    const existingReport = await prisma.forumPostReport.findFirst({
      where: { userId, postId },
    });

    if (existingReport) {
      return ResponseUtil.serverError('您已经举报过该帖子');
    }

    // 创建举报记录
    await prisma.forumPostReport.create({
      data: {
        userId,
        postId,
        content: content.trim(),
      },
    });

    return ResponseUtil.success('举报成功');
  } catch (error) {
    console.error('举报帖子失败:', error);
    return ResponseUtil.serverError('举报失败');
  }
} 