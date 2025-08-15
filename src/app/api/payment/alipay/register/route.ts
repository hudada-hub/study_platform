import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import prisma from '@/lib/prisma';
import { alipayService } from '@/services/alipay';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, type, phone, code, password, nickname } = body;

    // 验证必要参数
    if (!amount || !type || !phone || !code || !password || !nickname) {
      return ResponseUtil.error('缺少必要参数');
    }
    const isMock = process.env.IS_MOCK === 'true';
    if (!isMock) {
     // 验证手机验证码
     const validCode = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code,
        type: 'REGISTER',
        isUsed: false,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // 10分钟内有效
        }
      }
    });
    if (!validCode) {
      return ResponseUtil.error('验证码无效或已过期');
    }
    }
   

    

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return ResponseUtil.error('该手机号已注册');
    }

    // 生成订单号
    const orderNo = `REG${nanoid(16)}`;

    // 创建支付宝订单
    const result = await alipayService.createPaymentForm({
      outTradeNo: orderNo,
      totalAmount: amount,
      subject: '注册会员',
      body: '注册会员账号',
    });

    // 创建订单记录
    await prisma.registerOrder.create({
      data: {
        orderNo,
        amount,
        phone,
        nickname,
        status: 'PENDING',
        password
        // 其他字段如有需要可补充
      }
    });

    // // 标记验证码已使用
    // await prisma.verificationCode.update({
    //   where: { id: validCode.id },
    //   data: { isUsed: true }
    // });

    return ResponseUtil.success({
      orderNo,
      paymentForm: result,
      password
    });
  } catch (error: any) {
    console.error('创建支付订单失败:', error);
    return ResponseUtil.error(error.message || '创建支付订单失败');
  }
} 