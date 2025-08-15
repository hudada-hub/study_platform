import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';

// 处理评论点赞/取消点赞
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 验证用户身份
    const authResult = await verifyAuth(req);
    if (!authResult?.user) {
      return NextResponse.json(
        ResponseUtil.unauthorized('未登录'),
        { status: 401 }
      );
    }

    const commentId = parseInt((await params).id);
    if (isNaN(commentId)) {
      return NextResponse.json(
        ResponseUtil.error('无效的评论ID'),
        { status: 400 }
      );
    }

    // 检查评论是否存在
    const comment = await prisma.articleComment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return NextResponse.json(
        ResponseUtil.error('评论不存在'),
        { status: 404 }
      );
    }

    // 检查用户是否已经点赞过这条评论
    const existingLike = await prisma.articleCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId: authResult.user.id,
          commentId: commentId
        }
      }
    });

    if (existingLike) {
      // 如果已经点赞，则取消点赞
      await prisma.$transaction([
        prisma.articleCommentLike.delete({
          where: {
            userId_commentId: {
              userId: authResult.user.id,
              commentId: commentId
            }
          }
        }),
        prisma.articleComment.update({
          where: { id: commentId },
          data: {
            likeCount: {
              decrement: 1
            }
          }
        })
      ]);

      return NextResponse.json(
        ResponseUtil.success(
          { liked: false, likeCount: comment.likeCount - 1 },
          '取消点赞成功'
        )
      );
    } else {
      // 如果未点赞，则添加点赞
      await prisma.$transaction([
        prisma.articleCommentLike.create({
          data: {
            userId: authResult.user.id,
            commentId: commentId
          }
        }),
        prisma.articleComment.update({
          where: { id: commentId },
          data: {
            likeCount: {
              increment: 1
            }
          }
        })
      ]);

      return NextResponse.json(
        ResponseUtil.success(
          { liked: true, likeCount: comment.likeCount + 1 },
          '点赞成功'
        )
      );
    }
  } catch (error) {
    console.error('处理评论点赞失败:', error);
    return NextResponse.json(
      ResponseUtil.serverError('处理点赞失败，请稍后重试'),
      { status: 500 }
    );
  }
} 