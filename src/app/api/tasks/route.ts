import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const keyword = searchParams.get('keyword') || '';
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status'); // 新增状态筛选参数
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 构建查询条件
    const where: any = {
      isHidden: false,
    };

    // 关键词搜索
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // 分类筛选
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    // 状态筛选 - 如果没有指定状态，默认显示已通过的任务
    if (status) {
      where.status = status;
    } else {
      // 默认只显示已通过审核的任务
      where.status = 'APPROVED';
    }

    // 构建排序 - 优先按置顶排序，然后按发布时间排序
    let orderBy: any[] = [];
    
    if (sortBy === 'createdAt') {
      // 默认排序：置顶优先，然后按创建时间
      orderBy = [
        { isTop: 'desc' },        // 置顶优先
        { createdAt: sortOrder }, // 然后按创建时间排序
      ];
    } else if (sortBy === 'points') {
      // 积分排序：置顶优先，然后按积分排序
      orderBy = [
        { isTop: 'desc' },        // 置顶优先
        { points: sortOrder },    // 然后按积分排序
      ];
    } else if (sortBy === 'viewCount') {
      // 浏览排序：置顶优先，然后按浏览数排序
      orderBy = [
        { isTop: 'desc' },        // 置顶优先
        { viewCount: sortOrder }, // 然后按浏览数排序
      ];
    } else {
      // 其他排序：置顶优先，然后按指定字段排序
      orderBy = [
        { isTop: 'desc' },        // 置顶优先
        { [sortBy]: sortOrder },  // 然后按指定字段排序
      ];
    }

    // 查询任务列表
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          content: true,
          status: true,
          points: true,
          viewCount: true,
          isTop: true,        // 添加置顶字段
          completedAt: true,  // 添加截止时间字段
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              description: true,
            },
          },
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          applications: {
            select: {
              id: true,
              applicant: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    // 处理数据，添加applicationCount字段
    const processedTasks = tasks.map(task => ({
      ...task,
      applicationCount: task._count.applications,
      _count: undefined, // 移除_count字段
    }));

    return ResponseUtil.success({
      list: processedTasks,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    return ResponseUtil.error('获取任务列表失败');
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const {user} = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.error('请先登录');
    }

    const contentType = request.headers.get('content-type') || '';
    let title: string, content: string, categoryId: number, points: number, attachments: any[], completedAt: any;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      title = formData.get('title') as string;
      content = formData.get('content') as string;
      categoryId = parseInt(formData.get('categoryId') as string);
      points = parseInt(formData.get('points') as string);
      attachments = formData.get('attachments') ? JSON.parse(formData.get('attachments') as string) : [];
      completedAt = formData.get('completedAt');
    } else {
      const body = await request.json();
      title = body.title;
      content = body.content;
      categoryId = body.categoryId;
      points = body.points;
      attachments = body.attachments || [];
      completedAt = body.completedAt;
    }

    // 验证必填字段
    if (!title || !content || !categoryId || !points) {
      return ResponseUtil.error('请填写完整的任务信息');
    }

    if (title.length > 200) {
      return ResponseUtil.error('任务标题不能超过200个字符');
    }

    if (content.length < 10) {
      return ResponseUtil.error('任务详情不能少于10个字符');
    }

    if (points < 1 || points > 10000) {
      return ResponseUtil.error('悬赏积分必须在1-10000之间');
    }

    // 检查分类是否存在
    const category = await prisma.taskCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return ResponseUtil.error('选择的分类不存在');
    }

    // 检查用户积分是否足够
    if (user.points < points) {
      return ResponseUtil.error('您的积分不足，无法发布此任务');
    }

    // 使用事务来确保数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 扣除用户积分
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: { points: { decrement: points } },
      });

      // 创建任务
      const task = await tx.task.create({
        data: {
          title,
          content,
          categoryId,
          points,
          authorId: user.id,
          status: 'PENDING', // 默认待审核状态
          attachments: attachments || [],
          completedAt: completedAt ? new Date(parseInt(completedAt)) : null,
        },
      });

      // 生成订单
      const order = await tx.order.create({
        data: {
          orderNo: `TASK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'TASK',
          title: `任务发布 - ${title}`,
          amount: new Decimal(points), // 转换为Decimal类型
          status: 'PAID', // 任务发布订单直接标记为已支付
          paymentMethod: 'BALANCE',
          userId: user.id,
          taskId: task.id,
          remark: `发布任务：${title}`,
          expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后过期
        },
      });

      return { task, order, updatedUser };
    });

    return ResponseUtil.success(result.task, '任务发布成功，等待审核');
  } catch (error) {
    console.error('发布任务失败:', error);
    return ResponseUtil.error('发布任务失败');
  }
} 