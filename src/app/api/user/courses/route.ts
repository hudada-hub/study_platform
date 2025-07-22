import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { CourseLevel } from '@prisma/client';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // 鉴权，获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('请先登录');
    }
    const userId = user.id;

    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const directionId = searchParams.get('directionId');
    const level = searchParams.get('level');
    const keyword = searchParams.get('keyword');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    // 构建查询条件
    const where = {
      isDeleted: false,
      isHidden: false,
      uploaderId: userId,
      ...(categoryId ? { categoryId: parseInt(categoryId) } : {}),
      ...(directionId ? { directionId: parseInt(directionId) } : {}),
      ...(level ? { level: level as CourseLevel } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { description: { contains: keyword } },
              { summary: { contains: keyword } },
              { instructor: { contains: keyword } },
            ],
          }
        : {}),
    };

    // 获取总数
    const total = await prisma.course.count({ where });

    // 获取分页数据
    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        direction: { select: { name: true } },
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
    console.error('获取我的课程列表失败:', error);
    return ResponseUtil.error('获取我的课程列表失败');
  }
} 