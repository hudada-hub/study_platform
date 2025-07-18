import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取当前用户信息（可选）
    const userData = await verifyAuth(request);
    const userId = userData?.user?.id;

    const courseId = parseInt((await params).id);
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isDeleted: false,
        isHidden: false,
      },
      include: {
        chapters: {
          where: {
            parentId: null,
          },
          orderBy: {
            sort: 'asc',
          },
          include: {
            children: {
              orderBy: {
                sort: 'asc',
              },
            },
          },
        },
        // 包含点赞数据
        likes: {
          where: userId ? { userId } : undefined,
          take: userId ? 1 : 0,
        },
        _count: {
          select: {
            likes: true,
            favorites: true,
          },
        },
        // 包含收藏数据
        favorites: {
          where: userId ? { userId } : undefined,
          take: userId ? 1 : 0,
        },
        // 新增：包含分类信息
        category: true,
      },
    });

    if (!course) {
      return ResponseUtil.error('课程不存在');
    }

    // 转换响应数据格式
    const response = {
      ...course,
      isLiked: course.likes.length > 0,
      isFavorited: course.favorites.length > 0,
      likeCount: course._count.likes,
      favoriteCount: course._count.favorites,
      // 新增：分类名称
      categoryName: course.category?.name || '未分类',
      // 删除原始关联数据
      likes: undefined,
      favorites: undefined,
      _count: undefined,
      category: undefined,
    };

    return ResponseUtil.success(response);
  } catch (error) {
    console.error('获取课程详情失败:', error);
    return ResponseUtil.error('获取课程详情失败');
  }
}

// 更新课程
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const courseId = parseInt((await params).id);
    const data = await request.json();

    // 验证课程所有权
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        uploaderId: user.id,
      },
    });

    if (!existingCourse) {
      return ResponseUtil.error('无权修改此课程');
    }

    const course = await prisma.course.update({
      where: {
        id: courseId,
      },
      data,
    });

    return ResponseUtil.success(course);
  } catch (error) {
    return ResponseUtil.error('更新课程失败');
  }
}

// 删除课程
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const courseId = parseInt((await params).id);

    // 验证课程所有权
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: courseId,
        uploaderId: user.id,
      },
    });

    if (!existingCourse) {
      return ResponseUtil.error('无权删除此课程');
    }

    await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        isDeleted: true,
      },
    });

    return ResponseUtil.success(null);
  } catch (error) {
    return ResponseUtil.error('删除课程失败');
  }
} 