import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { CourseLevel,CourseStatus } from '@prisma/client';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const directionId = searchParams.get('directionId');
    const level = searchParams.get('level');
    const sort = searchParams.get('sort') || 'latest';

    // 构建查询条件
    const where = {
      isDeleted: false,
      isHidden: false,
      ...(categoryId ? { categoryId: parseInt(categoryId) } : {}),
      ...(directionId ? { directionId: parseInt(directionId) } : {}),
      ...(level ? { level: level as CourseLevel } : {}),
    };

    // 构建排序条件
    let orderBy: any = {};
    switch (sort) {
      case 'latest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'hot':
        orderBy = { viewCount: 'desc' };
        break;
      case 'rating':
        orderBy = { ratingScore: 'desc' };
        break;
      case 'price':
        orderBy = { totalDuration: 'asc' }; // 由于没有价格字段，这里暂时用时长代替
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        direction: {
          select: {
            name: true,
          },
        },
      },
    });
    
    return ResponseUtil.success(courses);
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return ResponseUtil.error('获取课程列表失败');
  }
}

// 创建课程
export async function POST(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const data = await request.json();

    const course = await prisma.course.create({
      data: {
        ...data,
        uploaderId: user.id,
      },
    });

    return ResponseUtil.success(course);
  } catch (error) {
    console.error('创建课程失败:', error);
    return ResponseUtil.error('创建课程失败');
  }
} 