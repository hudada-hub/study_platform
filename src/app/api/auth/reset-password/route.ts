// src/app/api/auth/reset-password/route.ts
import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { ResponseCode } from '@/utils/response';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, verificationCode, newPassword } = await request.json();

    // 验证输入
    if (!phone || !verificationCode || !newPassword) {
      return ResponseUtil.error('请填写完整信息');
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return ResponseUtil.error('手机号格式不正确');
    }

    // 验证验证码
    const validCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code: verificationCode,
        type: 'reset_password',
        isUsed: false,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // 10分钟内有效
        }
      }
    });

    if (!validCode) {
      return ResponseUtil.error('验证码错误或已过期');
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return ResponseUtil.error('该手机号未注册');
    }

    // 加密新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新用户密码
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // 标记验证码已使用
    await prisma.verificationCode.update({
      where: { id: validCode.id },
      data: { isUsed: true }
    });

    return ResponseUtil.success('密码重置成功');
  } catch (error) {
    console.error('重置密码失败:', error);
    return ResponseUtil.error('重置密码失败');
  }
}