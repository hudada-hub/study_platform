import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 获取课程评论列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = parseInt(searchParams.get('courseId') || '0');
  
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 获取用户信息（可选）
    const userData = await verifyAuth(request);
    const user = userData?.user;
    const userId = user?.id;

    // 构建查询条件
    const where = {
      courseId,
    };

    // 获取评论总数
    const total = await prisma.courseComment.count({ where });

    // 获取评论列表
    const comments = await prisma.courseComment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        _count: {
          select: { likes: true }
        },
        likes: userId ? {
          where: { userId }
        } : false
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // 处理返回数据
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user,
      likesCount: comment._count.likes,
      hasLiked: userId ? comment.likes.length > 0 : false,
      parentId: comment.parentId
    }));

    return ResponseUtil.success({
      items: formattedComments,
      total,
      page,
      pageSize
    });
  } catch (error) {
    console.error('获取课程评论失败:', error);
    return ResponseUtil.error('获取课程评论失败');
  }
}

// 创建课程评论
export async function POST(request: NextRequest) {
  try {
    const userData = await verifyAuth(request);
    const user = userData?.user;
    if (!user?.id) {
      return ResponseUtil.error('请先登录');
    }

    const body = await request.json();
    const { courseId, content, parentId } = body;

    // 验证必要参数
    if (!courseId || !content?.trim()) {
      return ResponseUtil.error('参数错误');
    }

    // 创建评论
    const comment = await prisma.courseComment.create({
      data: {
        content,
        courseId,
        userId: user.id,
        parentId
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        _count: {
          select: { likes: true }
        }
      }
    });

    return ResponseUtil.success({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user,
      likesCount: comment._count.likes,
      hasLiked: false
    });
  } catch (error) {
    console.error('创建课程评论失败:', error);
    return ResponseUtil.error('创建课程评论失败');
  }
} 