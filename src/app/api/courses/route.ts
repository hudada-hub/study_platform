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
    const keyword = searchParams.get('keyword');
    const sort = searchParams.get('sort') || 'latest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    // 构建查询条件
    const where = {
      isDeleted: false,
      isHidden: false,
      ...(categoryId ? { categoryId: parseInt(categoryId) } : {}),
      ...(directionId ? { directionId: parseInt(directionId) } : {}),
      ...(level ? { level: level as CourseLevel } : {}),
      // 关键词搜索 - 支持标题、描述、讲师字段的模糊搜索
      ...(keyword ? {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            description: {
              contains: keyword,
            },
          },
          {
            summary: {
              contains: keyword,
            },
          },
          {
            instructor: {
              contains: keyword,
            },
          },
        ],
      } : {}),
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

    // 获取总数
    const total = await prisma.course.count({ where });

    // 获取分页数据
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    
    return ResponseUtil.success({
      list: courses,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return ResponseUtil.error('获取课程列表失败');
  }
}