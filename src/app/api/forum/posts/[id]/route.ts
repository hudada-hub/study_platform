import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.serverError('无效的帖子ID');
    }

    // 获取当前用户信息（如果已登录）
    const { user } = await verifyAuth(request);
    const userId = user?.id;

    // 获取帖子详情，包含作者信息和统计数据
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            email: true,
            createdAt: true,
          },
        },
        section: {
          include: {
            category: true,
            moderator: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在');
    }

    // 获取作者的统计数据
    const [postCount, commentCount] = await Promise.all([
      prisma.forumPost.count({
        where: { authorId: post.authorId },
      }),
      prisma.forumComment.count({
        where: { authorId: post.authorId },
      }),
    ]);

    // 更新帖子的浏览量
    await prisma.forumPost.update({
      where: { id: postId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // 检查当前用户是否已收藏该帖子
    let isFavorited = false;
    if (userId) {
      const favorite = await prisma.forumPostFavorite.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      isFavorited = !!favorite;
    }

    // 格式化返回数据
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      author: {
        ...post.author,
        postCount,
        commentCount,
        viewCount: post.viewCount,
      },
      sectionId: post.sectionId,
      section: post.section,
      viewCount: post.viewCount + 1, // 包含当前访问
      commentCount: post.commentCount,
      likeCount: post.likeCount,
      isSticky: post.isTop, // 使用isTop作为置顶标识
      isTop: post.isTop,
      isEssence: post.isEssence,
      isHot: post.isHot,
      status: post.status,
      isFavorited, // 添加收藏状态字段
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    return ResponseUtil.success(formattedPost);
  } catch (error) {
    console.error('获取帖子详情失败:', error);
    return ResponseUtil.error('获取帖子详情失败', 500);
  }
} 

// 编辑帖子
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.serverError('请先登录');
    }

    const { id } = await params;
    const postId = parseInt(id);
    const userId = user.id;

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return ResponseUtil.serverError('标题和内容不能为空');
    }

    // 检查帖子是否存在且属于当前用户
    const post = await prisma.forumPost.findFirst({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    if (!post) {
      return ResponseUtil.serverError('帖子不存在或无权限编辑');
    }

    // 检查帖子状态，只有未审核和已发布的帖子可以编辑
    if (post.status === 'REJECTED') {
      return ResponseUtil.serverError('被拒绝的帖子不能编辑');
    }

    // 更新帖子
    const updatedPost = await prisma.forumPost.update({
      where: {
        id: postId,
      },
      data: {
        title: title.trim(),
        content: content.trim(),
        status: 'PENDING', // 编辑后重新进入审核状态
        updatedAt: new Date(),
      },
    });

    return ResponseUtil.success('编辑成功');
  } catch (error) {
    console.error('编辑帖子失败:', error);
    return ResponseUtil.serverError('编辑帖子失败');
  }
} 