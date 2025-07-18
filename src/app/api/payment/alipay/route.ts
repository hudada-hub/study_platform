import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import {alipayService} from '@/services/alipay';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

// 创建支付宝服务实例

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, productId, userId, title, type } = body;

    if (!amount || !productId || !userId || !title || !type) {
      return ResponseUtil.error('参数不完整');
    }

    // 生成订单号
    const orderNo = nanoid();

    // 创建订单记录
    const order = await prisma.order.create({
      data: {
        orderNo,
        amount,
        type,
        title,
        status: 'PENDING', // 待支付状态
        paymentMethod: 'ALIPAY',
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24小时后过期
        user: {
          connect: {
            id: userId
          }
        }
      },
    });

    // 生成支付表单
    const formHtml = await alipayService.createPaymentForm({
      outTradeNo: order.orderNo,
      totalAmount: amount,
      subject: title,
      body: `订单号: ${order.orderNo}`,
    });

    return ResponseUtil.success({ formHtml });
  } catch (error) {
    console.error('支付创建失败:', error);
    return ResponseUtil.serverError('支付创建失败');
  }
}

// 处理支付宝异步通知
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    // 将 FormData 转换为普通对象，并确保所有值都是字符串
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证签名
    if (!alipayService.verifyNotify(params)) {
      return ResponseUtil.error('签名验证失败');
    }

    const { out_trade_no, trade_status } = params;

    // 更新订单状态
    if (trade_status === 'TRADE_SUCCESS') {
      await prisma.order.update({
        where: { orderNo: out_trade_no },
        data: { 
          status: 'PAID',
          paymentTime: new Date()
        },
      });
    }

    return ResponseUtil.success(null, '支付通知处理成功');
  } catch (error) {
    console.error('支付通知处理失败:', error);
    return ResponseUtil.serverError('支付通知处理失败');
  }
} 