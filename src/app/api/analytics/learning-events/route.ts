import { NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录状态
    const userData = await verifyAuth(request);
    if (!userData?.user?.id) {
      return ResponseUtil.error('请先登录', 401);
    }

    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return ResponseUtil.error('事件数据格式错误');
    }

    const userId = userData.user.id;
    const processedEvents: any[] = [];

    // 处理每个学习事件
    for (const event of events) {
      // 验证事件数据格式
      if (!event.type || !event.courseId || !event.chapterId || !event.timestamp) {
        console.warn('跳过无效事件:', event);
        continue;
      }

      // 创建学习行为记录
      const learningEvent = await prisma.learningEvent.create({
        data: {
          userId,
          courseId: event.courseId,
          chapterId: event.chapterId,
          eventType: event.type,
          timestamp: new Date(event.timestamp),
          data: event.data ? JSON.stringify(event.data) : null,
        },
      });

      processedEvents.push(learningEvent);
    }

    return ResponseUtil.success({
      processedCount: processedEvents.length,
      message: '学习行为数据记录成功',
    });
  } catch (error) {
    console.error('记录学习行为数据失败:', error);
    return ResponseUtil.error('记录学习行为数据失败', 500);
  }
}

// 获取用户的学习行为统计
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录状态
    const userData = await verifyAuth(request);
    if (!userData?.user?.id) {
      return ResponseUtil.error('请先登录', 401);
    }

    const userId = userData.user.id;
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const chapterId = searchParams.get('chapterId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // 构建查询条件
    const where: any = { userId };
    
    if (courseId) {
      where.courseId = parseInt(courseId);
    }
    
    if (chapterId) {
      where.chapterId = parseInt(chapterId);
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // 获取学习行为统计
    const events = await prisma.learningEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100, // 限制返回数量
    });

    // 按事件类型分组统计
    const eventStats = await prisma.learningEvent.groupBy({
      by: ['eventType'],
      where,
      _count: { eventType: true },
    });

    // 计算总学习时长（基于播放事件）
    const playEvents = await prisma.learningEvent.findMany({
      where: {
        ...where,
        eventType: 'video_play',
      },
      select: {
        timestamp: true,
        data: true,
      },
    });

    let totalPlayTime = 0;
    for (const event of playEvents) {
      if (event.data) {
        try {
          const data = JSON.parse(event.data);
          if (data.playTime) {
            totalPlayTime += data.playTime;
          }
        } catch (e) {
          console.warn('解析事件数据失败:', e);
        }
      }
    }

    return ResponseUtil.success({
      events,
      stats: {
        totalEvents: events.length,
        eventTypeStats: eventStats,
        totalPlayTimeMinutes: Math.round(totalPlayTime / 60000), // 转换为分钟
      },
    });
  } catch (error) {
    console.error('获取学习行为统计失败:', error);
    return ResponseUtil.error('获取学习行为统计失败', 500);
  }
} 