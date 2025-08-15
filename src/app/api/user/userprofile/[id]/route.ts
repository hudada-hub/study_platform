import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return ResponseUtil.error('无效的用户ID');
    }

    // 查询用户信息，不需要token验证
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        avatar: true,
        bio: true,
        role: true,
        status: true,
        points: true,
        studyTime: true,
        loginCount: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        // 统计信息
        _count: {
          select: {
            Course: true, // 发布的课程
            forumPosts: true,
            forumComments: true,
            publishedTasks: true, // 发布的任务
            taskAssignments: true // 接受的任务
          }
        }
      }
    });

    if (!user) {
      return ResponseUtil.error('用户不存在');
    }

    // 格式化返回数据
    const userProfile = {
      id: user.id,
      nickname: user.nickname || '匿名用户',
      email: user.email || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      role: user.role,
      status: user.status,
      points: user.points || 0,
      studyTime: user.studyTime || 0,
      loginCount: user.loginCount || 0,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      // 统计信息
      publishedCourseCount: user._count.Course, // 发布的课程数量
      postCount: user._count.forumPosts,
      replyCount: user._count.forumComments,
      publishedTaskCount: user._count.publishedTasks, // 发布的任务数量
      acceptedTaskCount: user._count.taskAssignments, // 接受的任务数量
      totalEarnings: 0, // 暂时设为0，后续可以从订单表统计
      totalSpent: 0, // 暂时设为0，后续可以从订单表统计
    };

    return ResponseUtil.success(userProfile);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return ResponseUtil.error('获取用户资料失败', 500);
  }
} 