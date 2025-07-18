// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import * as argon2 from 'argon2';

export async function POST(request: Request) {
  try {
    const { username, email, newPassword } = await request.json();

    // 验证必填字段
    if (!username || !email || !newPassword) {
      return ResponseUtil.error('用户名、邮箱和新密码不能为空');
    }

    // 查找用户
    const user = await prisma.user.findFirst({
      where: { 
        username,
        email
      }
    });

    // 验证用户是否存在
    if (!user) {
      return ResponseUtil.error('用户名或邮箱不匹配，请确认信息正确');
    }

    // 密码加密
    const hashedPassword = await argon2.hash(newPassword);

    // 更新用户密码
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    return ResponseUtil.success(null, '密码重置成功，请使用新密码登录');

  } catch (error) {
    console.error('Password reset error:', error);
    return ResponseUtil.serverError();
  }
}