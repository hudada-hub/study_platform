import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 获取个人资料
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
        bio: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        role: true,
        points:true,
        studyTime:true
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
    console.error('获取个人资料失败:', error);
    return ResponseUtil.error('获取个人资料失败');
  }
}

// 更新个人资料
export async function PUT(req: NextRequest) {
  try {
    const userInfo = await verifyAuth(req);
    const userId = userInfo?.user?.id;
    if (!userId) {
      return ResponseUtil.unauthorized();
    }

    const data = await req.json();
    const { nickname, email, bio, avatar } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return ResponseUtil.error('用户不存在');
    }

    // 检查用户名是否已被使用
    if (nickname && nickname !== user.nickname) {
      const existingUser = await prisma.user.findUnique({
        where: { nickname }
      });
      if (existingUser) {
        return ResponseUtil.error('用户名已被使用');
      }
    }

    // 检查邮箱是否已被使用
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return ResponseUtil.error('邮箱已被使用');
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nickname: nickname || user.nickname,
        email: email || user.email,
        bio: bio !== undefined ? bio : user.bio,
        avatar: avatar !== undefined ? avatar : user.avatar
      },
      select: {
        id: true,
        nickname: true,
        email: true,
        bio: true,
        avatar: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return ResponseUtil.success(updatedUser);
  } catch (error) {
    console.error('更新个人资料失败:', error);
    return ResponseUtil.error('更新个人资料失败');
  }
}