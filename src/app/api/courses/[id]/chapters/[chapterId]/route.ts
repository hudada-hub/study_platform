import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';

// 更新课程章节
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id, chapterId } = await params;
    const data = await request.json();
    
    // 检查是否是父章节
    const chapter = await prisma.courseChapter.findUnique({
      where: { id: Number(chapterId) },
    });

    if (!chapter) {
      return ResponseUtil.error('章节不存在');
    }

    // 如果是父章节（没有parentId），不允许上传视频
    if (!chapter.parentId && data.videoUrl) {
      return ResponseUtil.error('父章节不能上传视频');
    }

    const updatedChapter = await prisma.courseChapter.update({
      where: {
        id: Number(chapterId),
      },
      data,
    });
    // 更新课程总时长
    if (updatedChapter.courseId) {
      const allChapters = await prisma.courseChapter.findMany({
        where: { courseId: updatedChapter.courseId },
        select: { duration: true }
      });
      const totalDuration = Math.round(allChapters.reduce((sum, c) => sum + (c.duration || 0), 0) );
      await prisma.course.update({
        where: { id: updatedChapter.courseId },
        data: { totalDuration }
      });
    }
    
    return ResponseUtil.success(updatedChapter);
  } catch (error) {
    return ResponseUtil.error('更新章节失败');
  }
}

// 删除课程章节
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string } > }
) {
  try {
    const { id, chapterId } = await params;

    
    // 检查是否有子章节
    const childrenCount = await prisma.courseChapter.count({
      where: {
        parentId: parseInt(chapterId),
      },
    });

    if (childrenCount > 0) {
      return ResponseUtil.error('请先删除所有子章节');
    }
    
    // 查询当前章节所属课程
    const chapter = await prisma.courseChapter.findUnique({ where: { id: Number(chapterId) } });
    // 删除当前章节
    await prisma.courseChapter.delete({
      where: {
        id: Number(chapterId),
      },
    });
    // 更新课程总时长
    if (chapter?.courseId) {
      const allChapters = await prisma.courseChapter.findMany({
        where: { courseId: chapter.courseId },
        select: { duration: true }
      });
      const totalDuration = Math.round(allChapters.reduce((sum, c) => sum + (c.duration || 0), 0) );
      await prisma.course.update({
        where: { id: chapter.courseId },
        data: { totalDuration }
      });
    }
    
    return ResponseUtil.success(null);
  } catch (error) {
    return ResponseUtil.error('删除章节失败');
  }
} 