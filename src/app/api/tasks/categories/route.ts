import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET() {
  try {
    const categories = await prisma.taskCategory.findMany({
      where: {
        // 可以根据需要添加筛选条件
      },
      orderBy: {
        sort: 'asc',
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return ResponseUtil.success(categories);
  } catch (error) {
    console.error('获取任务分类失败:', error);
    return ResponseUtil.error('获取任务分类失败');
  }
} 