import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import {alipayService} from '@/services/alipay';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const outTradeNo = searchParams.get('outTradeNo');

    if (!outTradeNo) {
      return ResponseUtil.error('订单号不能为空');
    }

    // 查询本地订单
    const order = await prisma.order.findFirst({
      where: {
        orderNo: outTradeNo,
      },
    });

    if (!order) {
      return ResponseUtil.error('订单不存在');
    }

    // 创建支付宝服务实例
    

    // 查询支付宝订单状态
    const alipayResult = await alipayService.queryOrder(outTradeNo);

    console.log(alipayResult,'alipayResult');
    // 解析支付宝返回结果
    const tradeStatus = alipayResult.tradeStatus;

    // 如果支付成功且本地订单状态未更新，则更新本地订单状态
    if (tradeStatus === 'TRADE_SUCCESS' && order.status === 'PENDING') {
      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: 'PAID',
          paymentTime: new Date(),
          paymentNo: alipayResult.trade_no,
        },
      });
    }

    // 返回订单信息
    return ResponseUtil.success({
      orderNo: order.orderNo,
      amount: order.amount,
      title: order.title,
      status: tradeStatus,
      paymentTime: order.paymentTime,
    });
  } catch (error) {
    console.error('查询订单状态失败:', error);
    return ResponseUtil.error('查询订单状态失败');
  }
} 