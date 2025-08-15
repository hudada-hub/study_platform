import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import { canModerateContent } from '@/utils/permissions';
import { ClientUser } from '@/utils/client-auth';

// 根据排序类型获取排序规则
function getOrderBy(sort: string) {
  switch (sort) {
    case 'hot': // 热门 - 按浏览量排序
      return [
        { isTop: 'desc' as const },
        { isEssence: 'desc' as const },
        { viewCount: 'desc' as const },
        { createdAt: 'desc' as const },
      ];
    case 'popular': // 热帖 - 按点赞数排序
      return [
        { isTop: 'desc' as const },
        { isEssence: 'desc' as const },
        { likeCount: 'desc' as const },
        { createdAt: 'desc' as const },
      ];
    case 'essence': // 精华 - 按精华状态排序
      return [
        { isTop: 'desc' as const },
        { isEssence: 'desc' as const },
        { createdAt: 'desc' as const },
      ];
    case 'latest': // 最新 - 按创建时间排序
    default:
      return [
        { isTop: 'desc' as const },
        { isEssence: 'desc' as const },
        { createdAt: 'desc' as const },
      ];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sectionId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const subsectionId = searchParams.get('subsectionId');
    const sort = searchParams.get('sort') || 'latest'; // 添加排序参数
    const skip = (page - 1) * pageSize;
    
    if (isNaN(sectionId)) {
      return ResponseUtil.error('无效的板块ID');
    }

    // 获取当前用户信息
    const { user } = await verifyAuth(request);
    
    // 构建查询条件
    let whereCondition: any = {};
    
    if (subsectionId) {
      // 如果指定了子版块，则筛选该子版块的帖子
      whereCondition.sectionId = parseInt(subsectionId);
    } else {
      // 否则筛选当前板块及其所有子版块的帖子
      const childSectionIds = await prisma.forumSection.findMany({
        where: { parentId: sectionId },
        select: { id: true }
      });
      
      const allSectionIds = [sectionId, ...childSectionIds.map(s => s.id)];
      whereCondition.sectionId = { in: allSectionIds };
    }

    // 获取版块信息以确定版主ID
    const sectionInfo = await prisma.forumSection.findUnique({
      where: { id: sectionId },
      select: { moderatorId: true }
    });

    // 根据用户权限过滤帖子状态
    // 如果是版主或超级管理员，显示所有状态的帖子
    // 如果是普通用户，只显示已发布的帖子
    if (!user || !canModerateContent(user as unknown as ClientUser, sectionInfo?.moderatorId)) {
      whereCondition.status = 'PUBLISHED';
      whereCondition.isDeleted = false; // 不显示已删除的帖子
    } else {
      // 版主或超级管理员可以看到所有状态的帖子，但不显示已删除的
      whereCondition.isDeleted = false;
    }

    // 查询帖子总数
    const totalPosts = await prisma.forumPost.count({
      where: whereCondition,
    });

    // 查询帖子列表，包含作者信息
    const posts = await prisma.forumPost.findMany({
      where: whereCondition,
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
            moderatorId: true,
          },
        },
      },
      orderBy: getOrderBy(sort), // 根据排序参数设置排序规则
      skip,
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
      isSticky: post.isTop,
      isTop: post.isTop,
      isEssence: post.isEssence,
      isHot: post.isHot,
      isNewbie: post.isNewbie,
      status: post.status,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    const totalPages = Math.ceil(totalPosts / pageSize);

    return ResponseUtil.success({
      posts: formattedPosts,
      totalPosts,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error('获取板块帖子失败:', error);
    return ResponseUtil.error('获取板块帖子失败', 500);
  }
} 