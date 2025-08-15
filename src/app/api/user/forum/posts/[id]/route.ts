import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 删除用户帖子
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

    // 检查帖子是否存在且属于当前用户
    const post = await prisma.forumPost.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在或无权限删除');
    }

    // 检查帖子状态，只有未审核和已发布的帖子可以删除
    if (post.status === 'REJECTED') {
      return ResponseUtil.serverError('被拒绝的帖子不能删除');
    }

    // 使用事务删除帖子及其所有关联数据
    await prisma.$transaction(async (tx) => {
      // 删除帖子的点赞记录
      await tx.forumPostLike.deleteMany({
        where: {
          postId: postId,
        },
      });

      // 删除帖子的收藏记录
      await tx.forumPostFavorite.deleteMany({
        where: {
          postId: postId,
        },
      });

      // 删除帖子的举报记录
      await tx.forumPostReport.deleteMany({
        where: {
          postId: postId,
        },
      });

      // 删除帖子的评论及其相关数据
      const comments = await tx.forumComment.findMany({
        where: {
          postId: postId,
        },
        select: {
          id: true,
        },
      });

      // 删除评论的点赞记录
      await tx.forumCommentLike.deleteMany({
        where: {
          commentId: {
            in: comments.map(c => c.id),
          },
        },
      });

      // 删除评论的踩记录
      await tx.forumCommentDislike.deleteMany({
        where: {
          commentId: {
            in: comments.map(c => c.id),
          },
        },
      });

      // 删除评论的举报记录
      await tx.forumCommentReport.deleteMany({
        where: {
          commentId: {
            in: comments.map(c => c.id),
          },
        },
      });

      // 删除所有评论
      await tx.forumComment.deleteMany({
        where: {
          postId: postId,
        },
      });

      // 删除帖子本身
      await tx.forumPost.delete({
        where: {
          id: postId,
        },
      });
    });

    return ResponseUtil.success('删除成功');
  } catch (error) {
    console.error('删除帖子失败:', error);
    return ResponseUtil.serverError('删除帖子失败');
  }
} 