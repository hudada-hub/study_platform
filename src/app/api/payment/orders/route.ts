import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import { randomBytes } from 'crypto';

// 生成订单号
function generateOrderNo() {
  // 生成20字节的随机数，转换为base64，并替换掉特殊字符
  return randomBytes(20)
    .toString('base64')
    .replace(/[+/=]/g, '')  // 移除特殊字符
    .substring(0, 20);  // 截取前20个字符
}

// 创建订单
export async function POST(req: NextRequest) {
  try {
    const {user} = await verifyAuth(req);
    if (!user) {
      return ResponseUtil.unauthorized('请先登录');
    }

    const body = await req.json();
    const { type, amount, points, title, paymentMethod } = body;

    // 验证必填字段
    if (!type || !amount || !title || !paymentMethod) {
      return ResponseUtil.serverError('缺少必要参数');
    }

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        type,
        amount:amount*100,
        expiredAt:new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        title,
        
        status: 'PENDING',
        paymentMethod,
        userId: user.id,
      },
    });

    return ResponseUtil.success({
      id: order.id,
      orderNo: order.orderNo,
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    return ResponseUtil.serverError('创建订单失败');
  }
}

// 获取订单列表
export async function GET(req: NextRequest) {
  try {
    const {user} = await verifyAuth(req);
    if (!user) {
      return ResponseUtil.unauthorized('请先登录');
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ResponseUtil.success({
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return ResponseUtil.serverError('获取订单列表失败');
  }
} 