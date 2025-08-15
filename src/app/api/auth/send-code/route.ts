import { NextRequest } from 'next/server';
import { ResponseUtil, ResponseCode } from '@/utils/response';
import { SmsService } from '@/services/sms';
import prisma from '@/lib/prisma';

// 从环境变量获取是否使用模拟验证码模式
const isMock = process.env.IS_MOCK === 'true';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, type = 'REGISTER' } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return ResponseUtil.error('请输入正确的手机号');
    }

    if (isMock) {
      // 模拟模式，向数据库添加验证码记录
      const mockCode = '666666';
      console.log(`模拟验证码：${mockCode}`);
      
      // 删除该手机号之前的验证码
      await prisma.verificationCode.deleteMany({
        where: { phone }
      });

      // 创建新的验证码记录
      await prisma.verificationCode.create({
        data: {
          phone,
          code: mockCode,
          type,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10分钟后过期
          isUsed: false
        }
      });

      return ResponseUtil.success({ code: mockCode }, '验证码发送成功');
    }

    // 正常发送验证码
    const result = await SmsService.sendVerificationCode(phone, type);
    
    if (result.code === ResponseCode.SUCCESS) {
      return ResponseUtil.success(null, '验证码发送成功');
    } else {
      return ResponseUtil.error(result.message);
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    return ResponseUtil.error('发送验证码失败');
  }
} 