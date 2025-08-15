import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.serverError('无效的帖子ID');
    }

    // 查询帖子的评论列表
    const comments = await prisma.forumComment.findMany({
      where: { postId },
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

    // 格式化评论数据
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      author: comment.author,
      postId: comment.postId,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return ResponseUtil.success(formattedComments);
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return ResponseUtil.error('获取评论列表失败', 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.serverError('无效的帖子ID');
    }

    const body = await request.json();
    const { content } = body;

    // 验证必填字段
    if (!content || !content.trim()) {
      return ResponseUtil.serverError('评论内容不能为空');
    }

    // 验证帖子是否存在
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在');
    }

    // 创建评论
    const comment = await prisma.forumComment.create({
      data: {
        content: content.trim(),
        postId: postId,
        authorId: 1, // 临时使用固定用户ID，实际应该从认证中获取
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
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return ResponseUtil.success({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      author: comment.author,
      postId: comment.postId,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('创建评论失败:', error);
    return ResponseUtil.error('创建评论失败', 500);
  }
} 