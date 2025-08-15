import { NextRequest, NextResponse } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { ResponseCode } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('未登录', ResponseCode.UNAUTHORIZED);
    }

    const { newPhone, verificationCode } = await request.json();

    // 验证输入
    if (!newPhone || !verificationCode) {
      return ResponseUtil.error('请填写完整信息');
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(newPhone)) {
      return ResponseUtil.error('手机号格式不正确');
    }

    // 检查新手机号是否已被其他用户使用
    const existingUser = await prisma.user.findUnique({
      where: { phone: newPhone }
    });

    if (existingUser && existingUser.id !== user.id) {
      return ResponseUtil.error('该手机号已被其他用户使用');
    }

    // 验证验证码
    const validCode = await prisma.verificationCode.findFirst({
      where: {
        phone: newPhone,
        code: verificationCode,
        type: 'change_phone',
        isUsed: false,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // 10分钟内有效
        }
      }
    });

    if (!validCode) {
      return ResponseUtil.error('验证码错误或已过期');
    }

    // 更新用户手机号
    await prisma.user.update({
      where: { id: user.id },
      data: { phone: newPhone }
    });

    // 标记验证码已使用
    await prisma.verificationCode.update({
      where: { id: validCode.id },
      data: { isUsed: true }
    });

    return ResponseUtil.success('手机号修改成功');
  } catch (error) {
    console.error('更换手机号失败:', error);
    return ResponseUtil.error('更换手机号失败');
  }
} 