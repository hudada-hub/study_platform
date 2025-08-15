import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import { PostStatus } from '@prisma/client';

// 更新帖子状态和属性
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('未授权访问');
    }

    const { id } = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.error('无效的帖子ID');
    }

    // 检查用户权限：版主或超级管理员
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        section: {
          include: {
            moderator: true
          }
        }
      }
    });

    if (!post) {
      return ResponseUtil.error('帖子不存在');
    }

    // 检查权限：超级管理员或该板块的版主
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const isModerator = post.section.moderatorId === user.id;
    
    if (!isSuperAdmin && !isModerator) {
      return ResponseUtil.error('权限不足');
    }

    const body = await request.json();
    const { 
      status, 
      isTop, 
      isEssence, 
      isHot 
    } = body;

    // 构建更新数据
    const updateData: any = {};
    
    if (status && Object.values(PostStatus).includes(status)) {
      updateData.status = status;
    }
    
    if (typeof isTop === 'boolean') {
      updateData.isTop = isTop;
    }
    
    if (typeof isEssence === 'boolean') {
      updateData.isEssence = isEssence;
    }
    
    if (typeof isHot === 'boolean') {
      updateData.isHot = isHot;
    }

    // 更新帖子
    const updatedPost = await prisma.forumPost.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        section: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return ResponseUtil.success(updatedPost);
  } catch (error) {
    console.error('更新帖子状态失败:', error);
    return ResponseUtil.error('更新帖子状态失败');
  }
}

// 删除帖子
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('未授权访问');
    }

    const { id } = await params;
    const postId = parseInt(id);
    
    if (isNaN(postId)) {
      return ResponseUtil.error('无效的帖子ID');
    }

    // 检查用户权限：版主或超级管理员
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        section: {
          include: {
            moderator: true
          }
        }
      }
    });

    if (!post) {
      return ResponseUtil.error('帖子不存在');
    }

    // 检查权限：超级管理员或该板块的版主
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const isModerator = post.section.moderatorId === user.id;
    
    if (!isSuperAdmin && !isModerator) {
      return ResponseUtil.error('权限不足');
    }

    // 软删除帖子
    await prisma.forumPost.update({
      where: { id: postId },
      data: { 
        isDeleted: true,
        status: 'DELETED'
      }
    });

    return ResponseUtil.success('帖子删除成功');
  } catch (error) {
    console.error('删除帖子失败:', error);
    return ResponseUtil.error('删除帖子失败');
  }
} 