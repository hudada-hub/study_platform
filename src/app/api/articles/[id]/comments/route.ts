import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';

// 获取文章评论
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const articleId = (await params).id;
    const authResult = await verifyAuth(request);
    const userId = authResult?.user?.id;

    const comments = await prisma.articleComment.findMany({
      where: { articleId: parseInt(articleId), isActive: true },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            nickname: true
          }
        },
        likes: userId ? {
          where: {
            userId: userId
          }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 转换评论数据，添加isLiked字段
    const formattedComments = comments.map(comment => ({
      ...comment,
      isLiked: comment.likes?.length > 0,
      likes: undefined // 移除likes字段
    }));

    return NextResponse.json(ResponseUtil.success(formattedComments));
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(ResponseUtil.serverError('服务器错误'), { status: 500 });
  }
}