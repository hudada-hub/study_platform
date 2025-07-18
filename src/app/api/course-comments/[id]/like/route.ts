import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 点赞/取消点赞评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userData = await verifyAuth(request);
    const user = userData?.user;
    if (!user?.id) {
      return ResponseUtil.error('请先登录');
    }

    const { id } = await params;
    const commentId = parseInt(id);
    if (!commentId) {
      return ResponseUtil.error('参数错误');
    }

    // 检查评论是否存在
    const comment = await prisma.courseComment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return ResponseUtil.error('评论不存在');
    }   

    // 检查是否已点赞
    const existingLike = await prisma.courseCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId
        }
      }
    });

    if (existingLike) {
      // 如果已点赞，则取消点赞
      await prisma.courseCommentLike.delete({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId
          }
        }
      });

      // 获取最新点赞数
      const likesCount = await prisma.courseCommentLike.count({
        where: { commentId }
      });

      return ResponseUtil.success({
        hasLiked: false,
        likesCount
      });
    } else {
      // 如果未点赞，则添加点赞
      await prisma.courseCommentLike.create({
        data: {
          userId: user.id,
          commentId
        }
      });

      // 获取最新点赞数
      const likesCount = await prisma.courseCommentLike.count({
        where: { commentId }
      });

      return ResponseUtil.success({
        hasLiked: true,
        likesCount
      });
    }
  } catch (error) {
    console.error('处理评论点赞失败:', error);
    return ResponseUtil.error('处理评论点赞失败');
  }
} 