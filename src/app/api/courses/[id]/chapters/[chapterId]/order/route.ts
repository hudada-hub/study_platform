import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 查询订单
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const userData = await verifyAuth(req);
    if (!userData?.user?.id) {
      return ResponseUtil.unauthorized('请先登录');
    }
    const { id, chapterId } = await params;

    // 查询是否已经购买过这个章节
    const order = await prisma.courseOrder.findFirst({
      where: {
        userId: userData.user.id,
        courseId: Number(id),
        chapterId: Number(chapterId),
      },
    });

    if (order) {
      // 如果找到订单，获取章节信息
      const chapter = await prisma.courseChapter.findUnique({
        where: {
          id: Number(chapterId),
          courseId: Number(id),
        },
        select: {
          videoUrl: true,
        },
      });

      return ResponseUtil.success({
        ...order,
        videoUrl: chapter?.videoUrl,
      });
    }

    return ResponseUtil.success(null);
  } catch (error) {
    console.error('查询课程章节订单失败:', error);
    return ResponseUtil.serverError('查询订单失败');
  }
}

// 创建订单
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const { id, chapterId } = await params;
    const courseId = parseInt(id);

    // 开启事务
    const result = await prisma.$transaction(async (tx) => {
      // 获取章节信息
      const chapter = await tx.courseChapter.findUnique({
        where: {
          id: parseInt(chapterId),
          courseId,
        },
      });

      if (!chapter) {
        throw new Error('章节不存在');
      }

      // 检查用户积分是否足够
      const currentUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { points: true },
      });

      if (!currentUser || currentUser.points < chapter.points) {
        throw new Error('积分不足');
      }

      // 检查是否已经购买过
      const existingOrder = await tx.courseOrder.findFirst({
        where: {
          userId: user.id,
          courseId,
          chapterId: parseInt(chapterId),
        },
      });

      if (existingOrder) {
        return {
          ...existingOrder,
          videoUrl: chapter.videoUrl,
        };
      }

      // 扣除用户积分
      await tx.user.update({
        where: { id: user.id },
        data: {
          points: {
            decrement: chapter.points,
          },
        },
      });

      // 创建订单
      const order = await tx.courseOrder.create({
        data: {
          userId: user.id,
          courseId,
          chapterId: parseInt(chapterId),
          points: chapter.points,
        },
      });

      return {
        ...order,
        videoUrl: chapter.videoUrl,
      };
    });

    return ResponseUtil.success(result);
  } catch (error: any) {
    console.error('创建章节订单失败:', error);
    return ResponseUtil.error(error.message || '创建订单失败');
  }
} 