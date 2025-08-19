import { NextRequest } from 'next/server';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 验证用户登录
    const authResult = await verifyAuth(request);
    if (!authResult?.user?.id) {
      return ResponseUtil.unauthorized('未登录');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 获取用户的提现记录
    const [records, total] = await Promise.all([
      prisma.withdrawRecord.findMany({
        where: {
          userId: authResult.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.withdrawRecord.count({
        where: {
          userId: authResult.user.id
        }
      })
    ]);

    return ResponseUtil.success({
      data: records,
      total,
      page,
      pageSize
    });

  } catch (error) {
    console.error('获取提现记录失败:', error);
    return ResponseUtil.serverError('获取提现记录失败');
  }
} 