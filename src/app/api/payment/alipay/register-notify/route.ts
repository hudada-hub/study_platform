import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import prisma from '@/lib/prisma';
import { alipayService } from '@/services/alipay';
import { hash } from 'argon2';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const params: Record<string, string> = {};
    
    // 将 FormData 转换为对象
    body.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证支付宝回调签名
    const signValid = await alipayService.verifyNotify(params);
    if (!signValid) {
      return new Response('fail', { status: 400 });
    }

    // 查询注册订单
    const order = await prisma.registerOrder.findUnique({
      where: { orderNo: params.out_trade_no }
    });

    if (!order) {
      return new Response('fail', { status: 400 });
    }

    // 只处理待支付订单，已支付直接返回
    if (order.status === 'PAID') {
      return new Response('success');
    }
    if (order.status !== 'PENDING') {
      return new Response('fail', { status: 400 });
    }

    console.log(params,'params');
    // 检查支付宝支付状态
    if (params.trade_status === 'TRADE_SUCCESS') {
      await prisma.$transaction(async (tx) => {
        // 1. 更新订单状态为已支付
        await tx.registerOrder.update({
          where: { orderNo: params.out_trade_no },
          data: {
            status: 'PAID',
            paymentNo: params.trade_no,
            paymentTime: new Date(),
          }
        });

        // 2. 创建用户及钱包（幂等处理）
        const password = order.password as string | undefined;
        if (!password) return;
        // 检查用户是否已存在
        const existUser = await tx.user.findUnique({ where: { phone: order.phone } });
        if (!existUser) {
          const user = await tx.user.create({
            data: {
              phone: order.phone,
              password: await hash(password),
              nickname: order.nickname,
              points: 0,
              status: 'ACTIVE',
            }
          });
          await tx.wallet.create({
            data: {
              userId: user.id,
              balance: 0
            }
          });
        }
      });
    }

    return new Response('success');
  } catch (error) {
    console.error('处理支付回调失败:', error);
    return new Response('fail', { status: 500 });
  }
} 