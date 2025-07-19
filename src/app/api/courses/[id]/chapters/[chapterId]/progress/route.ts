import { NextRequest, NextResponse } from 'next/server';

import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    // 验证用户登录状态
    const userData = await verifyAuth(request);
    if (!userData?.user?.id) {
      return ResponseUtil.error('请先登录', 401);
    }

    const {id, chapterId} = await params;
    const courseId = parseInt(id);
    const userId = userData.user.id;

    // 解析请求体
    const body = await request.json();
    const { progress } = body;

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return ResponseUtil.error('进度值无效');
    }

    // 检查用户是否已购买该章节
    const existingOrder = await prisma.courseOrder.findFirst({
      where: {
        userId,
        courseId,
        chapterId: parseInt(chapterId),
      },
    });

    if (!existingOrder) {
      return ResponseUtil.serverError('您尚未购买该章节');
    }

    // 更新或创建学习进度记录
    const updatedOrder = await prisma.courseOrder.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        progress,
        updatedAt: new Date(),
      },
    });

    return ResponseUtil.success({
      progress: updatedOrder.progress,
      message: '学习进度更新成功',
    });
  } catch (error) {
    console.error('更新学习进度失败:', error);
    return ResponseUtil.error('更新学习进度失败', 500);
  }
}

// 获取学习进度
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    // 验证用户登录状态
    const userData = await verifyAuth(request);
    if (!userData?.user?.id) {
      return ResponseUtil.error('请先登录', 401);
    }

    const courseId = parseInt(params.id);
    const chapterId = parseInt(params.chapterId);
    const userId = userData.user.id;

    // 查找用户的学习进度记录
    const order = await prisma.courseOrder.findFirst({
      where: {
        userId,
        courseId,
        chapterId,
      },
    });

    if (!order) {
      return ResponseUtil.success({
        progress: 0,
        hasPurchased: false,
      });
    }

    return ResponseUtil.success({
      progress: order.progress,
      hasPurchased: true,
    });
  } catch (error) {
    console.error('获取学习进度失败:', error);
    return ResponseUtil.error('获取学习进度失败', 500);
  }
} 