import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { hashPassword, verifyAuth, verifyPassword } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userData = await verifyAuth(request);
   
    if (!userData.user) {
      return ResponseUtil.unauthorized();
    }

    const profile = await prisma.user.findUnique({
      where: { id: userData.user.id },
      select: {
        nickname: true,
        email: true,
        avatar: true,
        bio: true
      }
    });

    return ResponseUtil.success(profile);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return ResponseUtil.serverError('获取用户信息失败');
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await verifyAuth(request);
    if (!userData.user) {
      return ResponseUtil.unauthorized();
    }

    const body = await request.json();
    
    await prisma.user.update({
      where: { id: userData.user.id },
      data: {
        nickname: body.nickname,
        bio: body.bio,
        avatar: body.avatar
      }
    });

    return ResponseUtil.success(null, '更新用户信息成功');
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return ResponseUtil.serverError('更新用户信息失败');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userData = await verifyAuth(request);
    if (!userData.user) {
      return ResponseUtil.unauthorized();
    }

    const formData = await request.formData();
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;

    if (!currentPassword || !newPassword) {
      return ResponseUtil.error('当前密码和新密码不能为空');
    }
    
    // 验证当前密码
    const valid = await verifyPassword(currentPassword, userData.user.password);
    if (!valid) {
      return ResponseUtil.error('当前密码不正确');
    }
    
    // 更新密码
    await prisma.user.update({
      where: { id: userData.user.id },
      data: {
        password: await hashPassword(newPassword)
      }
    });

    return ResponseUtil.success(null, '密码修改成功');
  } catch (error) {
    console.error('修改密码失败:', error);
    return ResponseUtil.serverError('修改密码失败');
  }
}