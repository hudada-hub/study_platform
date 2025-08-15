import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
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

    // 获取分页参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // 获取当前用户信息（如果已登录）
    let currentUserId: number | null = null;
    try {
      const { user } = await verifyAuth(request);
      currentUserId = user?.id || null;
    } catch (error) {
      // 用户未登录，继续执行
    }

    // 获取总评论数
    const totalComments = await prisma.forumComment.count({
      where: { 
        postId,
        parentId: null // 只统计顶级评论
      },
    });

    // 查询帖子的评论列表（只获取顶级评论）
    const comments = await prisma.forumComment.findMany({
      where: { 
        postId,
        parentId: null // 只获取顶级评论
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            createdAt: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      skip,
      take: pageSize,
    });

    // 格式化评论数据，包含用户点赞/反对状态和回复
    const formattedComments = await Promise.all(comments.map(async (comment) => {
      let isLiked = false;
      let isDisliked = false;

      // 如果用户已登录，检查点赞和反对状态
      if (currentUserId) {
        const [likeRecord, dislikeRecord] = await Promise.all([
          prisma.forumCommentLike.findUnique({
            where: { userId_commentId: { userId: currentUserId, commentId: comment.id } },
          }),
          prisma.forumCommentDislike.findUnique({
            where: { userId_commentId: { userId: currentUserId, commentId: comment.id } },
          }),
        ]);

        isLiked = !!likeRecord;
        isDisliked = !!dislikeRecord;
      }

      // 获取评论作者的统计数据
      const [authorPostCount, authorCommentCount] = await Promise.all([
        prisma.forumPost.count({
          where: { authorId: comment.authorId },
        }),
        prisma.forumComment.count({
          where: { authorId: comment.authorId },
        }),
      ]);

      // 格式化回复数据
      const formattedReplies = await Promise.all(comment.replies.map(async (reply) => {
        let replyIsLiked = false;
        let replyIsDisliked = false;

        // 如果用户已登录，检查回复的点赞和反对状态
        if (currentUserId) {
          const [replyLikeRecord, replyDislikeRecord] = await Promise.all([
            prisma.forumCommentLike.findUnique({
              where: { userId_commentId: { userId: currentUserId, commentId: reply.id } },
            }),
            prisma.forumCommentDislike.findUnique({
              where: { userId_commentId: { userId: currentUserId, commentId: reply.id } },
            }),
          ]);

          replyIsLiked = !!replyLikeRecord;
          replyIsDisliked = !!replyDislikeRecord;
        }

        // 获取回复作者的统计数据
        const [replyAuthorPostCount, replyAuthorCommentCount] = await Promise.all([
          prisma.forumPost.count({
            where: { authorId: reply.authorId },
          }),
          prisma.forumComment.count({
            where: { authorId: reply.authorId },
          }),
        ]);

        return {
          id: reply.id,
          content: reply.content,
          authorId: reply.authorId,
          author: {
            ...reply.author,
            postCount: replyAuthorPostCount,
            commentCount: replyAuthorCommentCount,
          },
          postId: reply.postId,
          parentId: reply.parentId,
          likeCount: reply.likeCount,
          dislikeCount: reply.dislikeCount,
          isLiked: replyIsLiked,
          isDisliked: replyIsDisliked,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
        };
      }));

      return {
        id: comment.id,
        content: comment.content,
        authorId: comment.authorId,
        author: {
          ...comment.author,
          postCount: authorPostCount,
          commentCount: authorCommentCount,
        },
        postId: comment.postId,
        parentId: comment.parentId,
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
        isLiked,
        isDisliked,
        replies: formattedReplies,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      };
    }));

    return ResponseUtil.success({
      list: formattedComments,
      total: totalComments,
      page,
      pageSize,
      totalPages: Math.ceil(totalComments / pageSize),
    });
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
    const {id} = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.serverError('无效的帖子ID');
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
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            createdAt: true,
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

    // 获取作者的统计数据
    const [authorPostCount, authorCommentCount] = await Promise.all([
      prisma.forumPost.count({
        where: { authorId: user.id },
      }),
      prisma.forumComment.count({
        where: { authorId: user.id },
      }),
    ]);

    return ResponseUtil.success({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      author: {
        ...comment.author,
        postCount: authorPostCount,
        commentCount: authorCommentCount,
      },
      postId: comment.postId,
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
      isLiked: false,
      isDisliked: false,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('创建评论失败:', error);
    return ResponseUtil.error('创建评论失败', 500);
  }
} 