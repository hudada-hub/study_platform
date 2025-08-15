import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import { TaskStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const taskId = parseInt(id);
    
    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

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

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        points: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        attachments: true,
        completedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        applications: {
          select: {
            id: true,
            createdAt: true,
            applicant: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        assignment: {
          select: {
            id: true,
            assignedAt: true,
            proof: true,
            fileUrls: true,
            assignee: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            favorites: true,
          },
        },
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在');
    }

    // 检查用户是否已点赞和收藏
    let hasLiked = false;
    let hasFavorited = false;

    if (currentUserId) {
      const [likeRecord, favoriteRecord] = await Promise.all([
        prisma.taskLike.findFirst({
          where: {
            taskId,
            userId: currentUserId,
          },
        }),
        prisma.taskFavorite.findFirst({
          where: {
            taskId,
            userId: currentUserId,
          },
        }),
      ]);

      hasLiked = !!likeRecord;
      hasFavorited = !!favoriteRecord;
    }

    // 增加浏览量
    await prisma.task.update({
      where: { id: taskId },
      data: { viewCount: { increment: 1 } },
    });

    // 构建返回数据
    const taskData = {
      ...task,
      likeCount: task._count.likes,
      favoriteCount: task._count.favorites,
      hasLiked,
      hasFavorited,
    };

    return ResponseUtil.success(taskData);
  } catch (error) {
    console.error('获取任务详情失败:', error);
    return ResponseUtil.error('获取任务详情失败');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user?.id) {
      return ResponseUtil.unauthorized('请先登录');
    }

    const { id } = await params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return ResponseUtil.error('无效的任务ID');
    }

    // 检查任务是否存在且属于当前用户
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        authorId: user.id,
        isDeleted: false,
      },
    });

    if (!existingTask) {
      return ResponseUtil.notFound('任务不存在或无权限修改');
    }

    // 解析请求数据
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = parseInt(formData.get('categoryId') as string);
    const points = parseInt(formData.get('points') as string);
    const status = formData.get('status') as string;
    const attachments = formData.get('attachments') ? JSON.parse(formData.get('attachments') as string) : [];
    const completedAt = formData.get('completedAt') as string;

    // 验证必填字段
    if (!title || !content || !categoryId || !points) {
      return ResponseUtil.error('请填写完整的任务信息');
    }

    if (title.length > 200) {
      return ResponseUtil.error('任务标题不能超过200个字符');
    }

    if (content.length < 10) {
      return ResponseUtil.error('任务详情不能少于10个字符');
    }

    if (points < 1 || points > 10000) {
      return ResponseUtil.error('积分范围应在1-10000之间');
    }

    // 检查分类是否存在
    const category = await prisma.taskCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return ResponseUtil.error('任务分类不存在');
    }

    // 更新任务
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        content,
        categoryId,
        points,
        status: (status as TaskStatus) || TaskStatus.PENDING, // 重置为待审核状态
        attachments: attachments || [],
        completedAt: completedAt ? new Date(parseInt(completedAt)) : null,
        updatedAt: new Date(),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    return ResponseUtil.success(updatedTask);
  } catch (error) {
    console.error('更新任务失败:', error);
    return ResponseUtil.error('更新任务失败');
  }
} 

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const { id } = await params;
    const taskId = parseInt(id);

    // 查找任务
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        author: true,
      },
    });

    if (!task) {
      return ResponseUtil.error('任务不存在');
    }

    // 检查权限：只有任务发布者才能删除
    if (task.authorId !== user.id) {
      return ResponseUtil.error('您没有权限删除此任务');
    }

    // 使用事务来确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 如果是待审核或已拒绝状态，返还积分
      if (task.status === 'PENDING' || task.status === 'REJECTED') {
        // 返还用户积分
        await tx.user.update({
          where: { id: user.id },
          data: { points: { increment: task.points } },
        });
      }

      // 删除任务（软删除）
      const deletedTask = await tx.task.update({
        where: { id: taskId },
        data: { 
          isDeleted: true,
          updatedAt: new Date(),
        },
      });

      return { deletedTask, pointsRefunded: task.status === 'PENDING' || task.status === 'REJECTED' };
    });

    const message = result.pointsRefunded 
      ? `任务删除成功，已返还 ${task.points} 积分` 
      : '任务删除成功';

    return ResponseUtil.success(result.deletedTask, message);
  } catch (error) {
    console.error('删除任务失败:', error);
    return ResponseUtil.error('删除任务失败');
  }
} 