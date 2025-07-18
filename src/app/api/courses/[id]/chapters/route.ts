import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { verifyAuth } from '@/utils/auth';

// 获取课程章节列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const { id } = await params;
    const courseId = parseInt(id);
    
    // 获取所有章节
    const chapters = await prisma.courseChapter.findMany({
      where: {
        courseId,
      },
      orderBy: {
        sort: 'asc',
      },
    });

    // 构建树形结构
    const buildTree = (items: any[], parentId: number | null = null): any[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    const treeData = buildTree(chapters);
    
    return ResponseUtil.success(treeData);
  } catch (error) {
    return ResponseUtil.error('获取章节列表失败');
  }
}

// 创建课程章节
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await verifyAuth(request);
    if (!user) {
      return ResponseUtil.unauthorized('未登录');
    }

    const { id } = await params;
    const courseId = parseInt(id);
    const data = await request.json();
    
    // 如果是父章节（没有parentId），不允许上传视频
    if (!data.parentId && data.videoUrl) {
      return ResponseUtil.error('父章节不能上传视频');
    }

    // 验证课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return ResponseUtil.error('课程不存在');
    }

    // 创建章节
    const chapter = await prisma.courseChapter.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        points: data.points,
        sort: data.sort,
        coverUrl:data.coverUrl,
        parent: data.parentId ? {
          connect: { id: data.parentId }
        } : undefined,
        duration: data.duration || 0,
        course: {
          connect: { id: courseId }
        },
        uploader: {
          connect: { id: user.id }
        }
      },
    });
    
    return ResponseUtil.success(chapter);
  } catch (error) {
    console.error('创建章节失败:', error);
    return ResponseUtil.error('创建章节失败');
  }
} 