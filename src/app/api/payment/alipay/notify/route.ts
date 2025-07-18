import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyNotify } from '@/utils/alipay';
import { ResponseUtil } from '@/utils/response';

export async function POST(req: NextRequest) {
  try {
    // 获取支付宝异步通知参数
    const params = await req.formData();
    const notifyData: Record<string, string> = {};
    params.forEach((value, key) => {
      notifyData[key] = value.toString();
    });

    // 验证签名
    const isValid = await verifyNotify(notifyData);
    if (!isValid) {
      console.error('支付宝异步通知验签失败');
      return new Response('fail');
    }

    // 获取订单信息
    const { out_trade_no, trade_status, total_amount } = notifyData;
    
    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo: out_trade_no },
    });

    if (!order) {
      console.error('订单不存在:', out_trade_no);
      return new Response('fail');
    }

    // 验证订单金额
    if (Number(total_amount) !== order.amount.toNumber()) {
      console.error('订单金额不匹配');
      return new Response('fail');
    }

    // 根据支付宝交易状态更新订单状态
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      // 更新订单状态
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentTime: new Date(),
        },
      });

      // 如果是充值订单，增加用户积分
      if (order.type === 'RECHARGE' && order.amount.toNumber() > 0) {
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            points: {
              increment: order.amount.toNumber()
            }
          }
        });
      }

      return new Response('success');
    }

    return new Response('fail');
  } catch (error) {
    console.error('处理支付宝回调失败:', error);
    return new Response('fail');
  }
} 