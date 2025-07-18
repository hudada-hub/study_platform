import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { ArticleStatus } from '@prisma/client';

// 获取文章列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = Number(searchParams.get('categoryId')); // 分类ID
    const page = Number(searchParams.get('page')) || 1; // 页码
    const pageSize = Number(searchParams.get('pageSize')) || 10; // 每页条数
    const keyword = searchParams.get('keyword') || ''; // 搜索关键词

    // 构建查询条件
    const where = {
      status: ArticleStatus.PUBLISHED,
      ...(categoryId ? {
        OR: [
          { categoryId }, // 直接匹配分类
          { category: { parentId: categoryId } } // 匹配子分类
        ]
      } : {}),
      ...(keyword ? {
        OR: [
          { title: { contains: keyword } },
          { summary: { contains: keyword } },
          { content: { contains: keyword } }
        ]
      } : {})
    };

    // 获取文章总数
    const total = await prisma.article.count({ where });

    // 获取分页数据
    const articles = await prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        summary: true,
        coverUrl: true, // 封面图URL
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            parent: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    return NextResponse.json(ResponseUtil.success({
      list: articles,
      pagination: {
        current: page,
        pageSize,
        total
      }
    }));
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(ResponseUtil.error('获取文章列表失败'));
  }
} 