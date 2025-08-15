import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 检查收藏状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.success({ isFavorited: false });
    }

    const {id} = await params;
    const sectionId = parseInt(id);
    const userId = user.id;

    // 检查是否已收藏
    const favorite = await prisma.forumSectionFavorite.findUnique({
      where: {
        userId_sectionId: {
          userId,
          sectionId,
        },
      },
    });

    return ResponseUtil.success({
      isFavorited: !!favorite,
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return ResponseUtil.serverError('检查收藏状态失败');
  }
} 