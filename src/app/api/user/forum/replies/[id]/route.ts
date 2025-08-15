import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录', 401);
    }

    const { id } = await params;
    const replyId = parseInt(id);
    if (isNaN(replyId)) {
      return ResponseUtil.error('无效的回复ID');
    }

    // 检查回复是否存在且属于当前用户
    const reply = await prisma.forumComment.findFirst({
      where: {
        id: replyId,
        authorId: user.id,
      },
    });

    if (!reply) {
      return ResponseUtil.error('回复不存在或无权限删除');
    }

    // 使用事务删除回复及其所有关联数据
    await prisma.$transaction(async (tx) => {
      // 1. 删除该回复的所有子回复
      await tx.forumComment.deleteMany({
        where: {
          parentId: replyId,
        },
      });

      // 2. 删除该回复的所有点赞记录
      await tx.forumCommentLike.deleteMany({
        where: {
          commentId: replyId,
        },
      });

      // 3. 删除该回复的所有反对记录
      await tx.forumCommentDislike.deleteMany({
        where: {
          commentId: replyId,
        },
      });

      // 4. 删除该回复的所有举报记录
      await tx.forumCommentReport.deleteMany({
        where: {
          commentId: replyId,
        },
      });

      // 5. 最后删除回复本身
      await tx.forumComment.delete({
        where: {
          id: replyId,
        },
      });
    });

    return ResponseUtil.success({ message: '删除成功' });
  } catch (error) {
    console.error('删除回复失败:', error);
    return ResponseUtil.error('删除回复失败');
  }
} 