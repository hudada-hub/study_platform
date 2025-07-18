// src/app/api/auth/login/route.ts
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import {  UserStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { account, password } = await request.json();

    // 验证必填字段
    if (!account || !password) {
      return ResponseUtil.error('请输入账号和密码');
    }

    // 查找用户（支持手机号或昵称登录）
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: account },
          { nickname: account }
        ]
      },
      select: {
        id: true,
        nickname: true,
        phone: true,
        password: true,
        email: true,
        status: true,
        avatar: true,
        loginCount: true,
        role: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      }
    });

    // 验证用户是否存在
    if (!user) {
      return ResponseUtil.error('账号或密码错误');
    }

    // 验证密码
    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return ResponseUtil.error('账号或密码错误');
    }

    // 验证用户状态是否正常
    if (user.status !== UserStatus.ACTIVE) {
      return ResponseUtil.error('账号状态异常，请联系管理员');
    }

    // 更新登录信息
    const clientIp = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
                    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginCount: (user.loginCount || 0) + 1,
        lastLoginAt: new Date(),
        lastLoginIp: clientIp
      }
    });

    // 生成 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        status: user.status,
        avatar: user.avatar,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 返回成功响应
    return ResponseUtil.success({
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        phone: user.phone,
        email: user.email,
        status: user.status,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
      }
    }, '登录成功');

  } catch (error) {
    console.error('Login error:', error);
    return ResponseUtil.serverError('登录失败，请稍后重试');
  }
}