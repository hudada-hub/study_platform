import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNo = searchParams.get('orderNo');
  if (!orderNo) {
    return ResponseUtil.error('缺少订单号');
  }
  const order = await prisma.registerOrder.findUnique({ where: { orderNo } });
  if (!order) {
    return ResponseUtil.error('订单不存在');
  }
  // 状态映射
  let status: 'SUCCESS' | 'PENDING' | 'FAILED' = 'PENDING';
  if (order.status === 'PAID') status = 'SUCCESS';
  if (order.status === 'CANCELLED' || order.status === 'REFUNDED' || order.status === 'FAILED') status = 'FAILED';
  return ResponseUtil.success({
    status,
    type: 'REGISTER',
    phone: order.phone,
    password: order.password || '',
  });
} 