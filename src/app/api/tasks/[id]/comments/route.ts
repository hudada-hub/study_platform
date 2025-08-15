import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 查询评论（只查询顶级评论）
    const [comments, total] = await Promise.all([
      prisma.taskComment.findMany({
        where: {
          taskId,
          parentId: null, // 只查询顶级评论
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              likes: {
                select: {
                  userId: true,
                },
              },
              parent: {
                select: {
                  id: true,
                  content: true,
                  author: {
                    select: {
                      id: true,
                      nickname: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.taskComment.count({
        where: {
          taskId,
          parentId: null, // 只统计顶级评论
        },
      }),
    ]);

    // 获取当前用户信息（如果已登录）
    let currentUserId: number | null = null;
    try {
      const authResult = await verifyAuth(request);
      if (authResult.user) {
        currentUserId = authResult.user.id;
      }
    } catch (error) {
      // 用户未登录，继续处理
    }

    // 处理评论数据，添加点赞信息
    const processedComments = comments.map(comment => ({
      ...comment,
      likesCount: comment.likes.length,
      hasLiked: currentUserId ? comment.likes.some(like => like.userId === currentUserId) : false,
      replies: comment.replies.map(reply => ({
        ...reply,
        likesCount: reply.likes.length,
        hasLiked: currentUserId ? reply.likes.some(like => like.userId === currentUserId) : false,
      })),
    }));

    return ResponseUtil.success({
      items: processedComments,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取任务评论失败:', error);
    return ResponseUtil.error('获取任务评论失败');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    // 获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const contentType = request.headers.get('content-type') || '';
    let content: string;
    let parentId: number | null = null;
    let pics: string[] = [];

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      content = formData.get('content') as string;
      const parentIdStr = formData.get('parentId') as string;
      parentId = parentIdStr ? parseInt(parentIdStr) : null;
      const picsStr = formData.get('pics') as string;
      pics = picsStr ? JSON.parse(picsStr) : [];
    } else {
      const body = await request.json();
      content = body.content;
      parentId = body.parentId || null;
      pics = body.pics || [];
    }

    if (!content || !content.trim()) {
      return ResponseUtil.error('评论内容不能为空');
    }

    // 如果有parentId，检查父评论是否存在
    if (parentId) {
      const parentComment = await prisma.taskComment.findUnique({
        where: {
          id: parentId,
          taskId, // 确保父评论属于同一个任务
        },
      });

      if (!parentComment) {
        return ResponseUtil.error('父评论不存在');
      }
    }

    // 检查任务是否存在
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        isDeleted: false,
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在');
    }

    // 创建评论
    const comment = await prisma.taskComment.create({
      data: {
        content: content.trim(),
        taskId,
        authorId: user.id,
        parentId,
        pics,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        parent: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
      },
    });

    return ResponseUtil.success(comment, '评论发布成功');
  } catch (error) {
    console.error('发布评论失败:', error);
    return ResponseUtil.error('发布评论失败');
  }
} 