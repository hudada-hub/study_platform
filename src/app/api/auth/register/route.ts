// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseCode } from '@/utils/response';
import * as argon2 from 'argon2';
import { ResponseUtil } from '@/utils/response';
import { SmsService } from '@/services/sms';
import jwt from 'jsonwebtoken';

// 获取环境变量
const isMock = process.env.IS_MOCK === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code, password, nickname } = body;

    if (!phone || !code || !password || !nickname) {
      return ResponseUtil.error('请填写完整信息');
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return ResponseUtil.error('手机号格式不正确');
    }

    // 验证昵称长度
    if (nickname.length < 2 || nickname.length > 20) {
      return ResponseUtil.error('昵称长度需在2-20个字符之间');
    }

    // 验证码验证
    let verifyResult;
    if (isMock && code === '666666') {
      // 模拟模式下，验证码为666666时直接通过
      verifyResult = { code: ResponseCode.SUCCESS, message: '验证成功' };
    } else {
      // 正常模式下验证验证码
      verifyResult = await SmsService.verifyCode(phone, code);
    }

    if (verifyResult.code !== ResponseCode.SUCCESS) {
      return ResponseUtil.error(verifyResult.message);
    }

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) {
      return ResponseUtil.error('该手机号已注册');
    }

    // 检查昵称是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: {
        nickname: nickname,
      },
    });

    if (existingUsername) {
      return ResponseUtil.error('该昵称已被使用');
    }

    // 密码加密
    const hashedPassword = await argon2.hash(password);
    let avatarArr = ['/default-avatar.png','/avatar1.png','/avatar2.png','/avatar3.png','/avatar4.png','/avatar5.png','/avatar6.png','/avatar7.jpg','/avatar9.webp'];
    //随机选择一个头像
    let avatar = avatarArr[Math.floor(Math.random() * avatarArr.length)];
    // 创建用户
    const user = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        nickname: nickname,
        avatar: avatar,
        role: 'USER',
        status: 'ACTIVE',
      },
    });


    // 生成token，包含用户关键信息
    const token = jwt.sign({
      id: user.id,
      phone: user.phone,
      avatar: avatar,
      nickname: user.nickname,
      role: user.role,
      status: user.status,
    }, JWT_SECRET, {
      expiresIn: '7d', // token有效期7天
    });

    return ResponseUtil.success({
      token,
      user: {
        id: user.id,
        avatar: user.avatar,
        nickname: user.nickname,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }, '注册成功');

  } catch (error) {
    console.error('注册失败:', error);
    return ResponseUtil.error('注册失败，请稍后重试');
  }
}