import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 获取当前用户完整信息
export async function GET(req: NextRequest) {
  try {
    const userInfo = await verifyAuth(req);
    
    const userId = userInfo?.user?.id;

    if (!userId) {
      return ResponseUtil.unauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        phone: true,
        bio: true,
        avatar: true,
        status: true,
        role: true,
        points: true,
        studyTime: true,
        courseCount: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        loginCount: true,
        lastLoginIp: true,
        wechat: true,
        qq: true,
      }
    });

    if (!user) {
      return ResponseUtil.error('用户不存在');
    }

    return ResponseUtil.success({
      ...user,
      _count: undefined
    });
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    return ResponseUtil.error('获取当前用户信息失败');
  }
} 