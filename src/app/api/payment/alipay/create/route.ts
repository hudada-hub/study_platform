import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';
import { alipayService } from '@/services/alipay';

export async function POST(req: NextRequest) {
  try {
    const { user } = await verifyAuth(req);
    if (!user) {
      return ResponseUtil.unauthorized('请先登录');
    }

    const body = await req.json();
    const { orderNo, totalAmount, subject, body: tradeBody } = body;

    // 验证订单是否存在且属于当前用户
    const order = await prisma.order.findFirst({
      where: {
        orderNo,
        userId: user.id,
        status: 'PENDING'  // 只能支付待支付的订单
      }
    });

    if (!order) {
      return ResponseUtil.serverError('订单不存在或状态异常');
    }

    // 创建支付表单，使用数据库中的订单号
    const formHtml = await alipayService.createPaymentForm({
      outTradeNo: orderNo,  // 使用传入的订单号
      totalAmount,
      subject,
      body: tradeBody,
    });

    return ResponseUtil.success({
      formHtml
    });
  } catch (error) {
    console.error('创建支付宝订单失败:', error);
    return ResponseUtil.serverError('创建支付宝订单失败');
  }
} 