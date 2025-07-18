import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET() {
  try {
    // 获取所有分类，包括子分类
    const categories = await prisma.articleCategory.findMany({
      where: {
        parentId: null // 只获取顶级分类
      },
      include: {
        children: true // 包含子分类
      },
      orderBy: {
        sort: 'asc' // 按照排序字段排序
      }
    });

    return NextResponse.json(ResponseUtil.success(categories));
  } catch (error) {
    console.error('获取文章分类失败:', error);
    return NextResponse.json(ResponseUtil.error('获取文章分类失败'));
  }
} 