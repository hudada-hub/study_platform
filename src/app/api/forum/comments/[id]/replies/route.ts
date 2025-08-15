import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id);
    
    if (isNaN(commentId)) {
      return ResponseUtil.serverError('无效的评论ID');
    }

    // 获取当前用户信息（如果已登录）
    let currentUserId: number | null = null;
    try {
      const { user } = await verifyAuth(request);
      currentUserId = user?.id || null;
    } catch (error) {
      // 用户未登录，继续执行
    }

    // 查询评论的回复列表
    const replies = await prisma.forumComment.findMany({
      where: { parentId: commentId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 格式化回复数据，包含用户点赞/反对状态
    const formattedReplies = await Promise.all(replies.map(async (reply) => {
      let isLiked = false;
      let isDisliked = false;

      // 如果用户已登录，检查点赞和反对状态
      if (currentUserId) {
        const [likeRecord, dislikeRecord] = await Promise.all([
          prisma.forumCommentLike.findUnique({
            where: { userId_commentId: { userId: currentUserId, commentId: reply.id } },
          }),
          prisma.forumCommentDislike.findUnique({
            where: { userId_commentId: { userId: currentUserId, commentId: reply.id } },
          }),
        ]);

        isLiked = !!likeRecord;
        isDisliked = !!dislikeRecord;
      }

      return {
        id: reply.id,
        content: reply.content,
        authorId: reply.authorId,
        author: reply.author,
        postId: reply.postId,
        parentId: reply.parentId,
        likeCount: reply.likeCount,
        dislikeCount: reply.dislikeCount,
        isLiked,
        isDisliked,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      };
    }));

    return ResponseUtil.success(formattedReplies);
  } catch (error) {
    console.error('获取回复列表失败:', error);
    return ResponseUtil.error('获取回复列表失败', 500);
  }
}

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

    // 验证用户登录
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const body = await request.json();
    const { content } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return ResponseUtil.serverError('回复内容不能为空');
    }

    // 验证父评论是否存在
    const parentComment = await prisma.forumComment.findUnique({
      where: { id: commentId },
      include: { post: true },
    });

    if (!parentComment) {
      return ResponseUtil.serverError('评论不存在');
    }

    // 创建回复
    const reply = await prisma.forumComment.create({
      data: {
        content: content.trim(),
        postId: parentComment.postId,
        authorId: user.id,
        parentId: commentId,
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

    // 更新帖子的评论数量
    await prisma.forumPost.update({
      where: { id: parentComment.postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return ResponseUtil.success({
      id: reply.id,
      content: reply.content,
      authorId: reply.authorId,
      author: reply.author,
      postId: reply.postId,
      parentId: reply.parentId,
      likeCount: reply.likeCount,
      dislikeCount: reply.dislikeCount,
      isLiked: false,
      isDisliked: false,
      createdAt: reply.createdAt.toISOString(),
      updatedAt: reply.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('创建回复失败:', error);
    return ResponseUtil.error('创建回复失败', 500);
  }
} 