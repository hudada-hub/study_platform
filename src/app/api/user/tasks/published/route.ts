import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: {
          authorId: user.id,
          isDeleted: false,
        },
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          points: true,
          viewCount: true,
          completedAt: true,
          rejectReason: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { id: true, name: true } },
          author: { select: { id: true, nickname: true, avatar: true } },
          applications: {
            select: {
              id: true,
              applicant: { select: { id: true, nickname: true, avatar: true } },
            },
          },
          assignment: {
            select: {
              id: true,
              assignee: { select: { id: true, nickname: true, avatar: true } },
            },
          },
          _count: { select: { applications: true, likes: true, favorites: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({
        where: {
          authorId: user.id,
          isDeleted: false,
        },
      }),
    ]);

    const formattedTasks = tasks.map(task => ({
      ...task,
      applicationCount: task._count.applications,
      likeCount: task._count.likes,
      favoriteCount: task._count.favorites,
    }));

    return ResponseUtil.success({ items: formattedTasks, total, page, pageSize });
  } catch (error) {
    console.error('获取发布任务失败:', error);
    return ResponseUtil.error('获取发布任务失败');
  }
} 