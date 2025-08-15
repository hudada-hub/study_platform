import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(request: NextRequest) {
  try {
    // 获取帖子总数
    const postCount = await prisma.forumPost.count({
      where: {
        status: 'PUBLISHED',
      },
    });

    // 获取本月登录会员总数（本月有登录记录的用户）
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const memberCount = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: firstDayOfMonth,
        },
        status: 'ACTIVE',
      },
    });

    return ResponseUtil.success({
      postCount,
      memberCount,
    });
  } catch (error) {
    console.error('获取论坛统计数据失败:', error);
    return ResponseUtil.error('获取论坛统计数据失败');
  }
} 