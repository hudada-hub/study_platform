import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseCode, ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sort = searchParams.get('sort') || 'createdAt';
    const sectionId = searchParams.get('sectionId');
    const status = searchParams.get('status') || 'PUBLISHED';

    // 构建查询条件
    const where = {
      status: status as any,
      ...(sectionId ? { sectionId: parseInt(sectionId) } : {}),
    };

    // 构建排序条件
    let orderBy: any = {};
    switch (sort) {
      case 'createdAt':
        orderBy = { createdAt: 'desc' };
        break;
      case 'viewCount':
        orderBy = { viewCount: 'desc' };
        break;
      case 'commentCount':
        orderBy = { commentCount: 'desc' };
        break;
      case 'likeCount':
        orderBy = { likeCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // 获取总数
    const total = await prisma.forumPost.count({ where });

    // 获取分页数据
    const posts = await prisma.forumPost.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 处理数据格式
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      author: post.author,
      sectionId: post.sectionId,
      section: post.section,
      viewCount: post.viewCount,
      commentCount: post.commentCount,
      likeCount: post.likeCount,
      isTop: post.isTop,
      isEssence: post.isEssence,
      isHot: post.isHot,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    return ResponseUtil.success({
      items: formattedPosts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('获取帖子列表失败:', error);
    return ResponseUtil.error('获取帖子列表失败', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录', 401);
    }

    const body = await request.json();
    const { title, content, sectionId } = body;

    // 验证必填字段
    if (!title || !content || !sectionId) {
      return ResponseUtil.serverError('标题、内容和板块ID不能为空');
    }

    // 验证标题长度
    if (title.length > 200) {
      return ResponseUtil.serverError('标题不能超过200字符');
    }

    // 验证板块是否存在
    const section = await prisma.forumSection.findUnique({
      where: { id: parseInt(sectionId) },
    });

    if (!section) {
      return ResponseUtil.serverError('板块不存在');
    }

    // 创建帖子
    const post = await prisma.forumPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
        sectionId: parseInt(sectionId),
        status: 'PENDING', // 默认待审核状态
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 更新板块的最后发帖时间和帖子数量
    await prisma.forumSection.update({
      where: { id: parseInt(sectionId) },
      data: {
        lastPostAt: new Date(),
        postCount: {
          increment: 1,
        },
      },
    });

    return ResponseUtil.success({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      author: post.author,
      sectionId: post.sectionId,
      section: post.section,
      viewCount: post.viewCount,
      commentCount: post.commentCount,
      likeCount: post.likeCount,
      isSticky: post.isTop,
      isTop: post.isTop,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('发帖失败:', error);
    return ResponseUtil.error('发帖失败', 500);
  }
} 