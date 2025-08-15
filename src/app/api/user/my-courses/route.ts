import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 获取用户已购买的课程列表
export async function GET(request: NextRequest) {
  try {
    const { user } = await verifyAuth(request);
    if (!user?.id) {
      return ResponseUtil.unauthorized('请先登录');
    }

    // 获取用户已购买的课程章节
    const courseOrders = await prisma.courseOrder.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            },
            direction: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        chapter: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // 按课程分组并统计学习进度
    const courseMap = new Map();
    
    courseOrders.forEach(order => {
      const courseId = order.course.id;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          ...order.course,
          learnedChapterCount: 0,
          totalChapters: 0,
          purchasedChapterCount: 0,
          chapters: []
        });
      }
      
      const courseData = courseMap.get(courseId);
      
      // 检查是否是一次性支付课程（chapterId为null）
      if (order.oneTimePayment && order.chapterId === null) {
        // 一次性支付课程，不添加具体章节信息
        courseData.purchasedChapterCount++;
        if (order.progress >= 90) {
          courseData.learnedChapterCount++;
        }
      } else if (order.chapter && order.chapter.id) {
        // 普通章节订单，添加章节信息
      courseData.chapters.push({
        id: order.chapter.id,
        title: order.chapter.title,
        progress: order.progress
      });
      
      // 统计已购买的章节数
      courseData.purchasedChapterCount++;
      
      // 统计已完成的章节数（进度大于等于90%视为完成）
      if (order.progress >= 90) {
        courseData.learnedChapterCount++;
        }
      }
    });

    // 获取每个课程的总章节数
    const courseIds = Array.from(courseMap.keys());
    const coursesWithChapterCount = await prisma.course.findMany({
      where: {
        id: { in: courseIds }
      },
      include: {
        _count: {
          select: {
            chapters: true
          }
        }
      }
    });

    // 更新总章节数
    coursesWithChapterCount.forEach(course => {
      if (courseMap.has(course.id)) {
        const courseData = courseMap.get(course.id);
        courseData.totalChapters = course._count.chapters;
      }
    });

    // 转换为数组并移除章节详细信息
    const processedCourses = Array.from(courseMap.values()).map(course => {
      const { chapters, ...courseData } = course;
      return {
        ...courseData,
        // 学习章节数应该是已购买的章节数，而不是总章节数
        learnedChapterCount: courseData.purchasedChapterCount
      };
    });

    return ResponseUtil.success(processedCourses);
  } catch (error) {
    console.error('获取用户课程列表失败:', error);
    return ResponseUtil.error('获取用户课程列表失败');
  }
} 