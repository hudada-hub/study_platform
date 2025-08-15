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

    const [assignments, total] = await Promise.all([
      prisma.taskAssignment.findMany({
        where: {
          assigneeId: user.id,
        },
        include: {
          task: {
            include: {
              category: { select: { id: true, name: true } },
              author: { select: { id: true, nickname: true, avatar: true } },
              _count: { select: { applications: true, likes: true, favorites: true } },
            },
          },
          assignee: { select: { id: true, nickname: true, avatar: true } },
        },
        orderBy: { assignedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.taskAssignment.count({
        where: {
          assigneeId: user.id,
        },
      }),
    ]);

    const formattedTasks = assignments.map(assignment => ({
      ...assignment.task,
      assignment: {
        id: assignment.id,
        assignee: assignment.assignee,
        assignedAt: assignment.assignedAt,
        proof: assignment.proof,
        fileUrls: assignment.fileUrls,
      },
      applicationCount: assignment.task._count.applications,
      likeCount: assignment.task._count.likes,
      favoriteCount: assignment.task._count.favorites,
    }));

    return ResponseUtil.success({ items: formattedTasks, total, page, pageSize });
  } catch (error) {
    console.error('获取接受任务失败:', error);
    return ResponseUtil.error('获取接受任务失败');
  }
} 