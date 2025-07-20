import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {  verifyAuth } from '@/utils/auth';
import { ResponseUtil } from '@/utils/response';
// 提交评论
export async function POST(request: NextRequest) {
  try {
    const { content, articleId, parentCommentId } = await request.json(); // 新增父评论ID参数
      const userData = await verifyAuth(request);
      if (!userData.user) {
        return NextResponse.json(ResponseUtil.error('未登录'), { status: 401 });
      }
      let user = userData.user;
      // 验证评论内容和文章ID
      if (!content?.trim()) {
        return NextResponse.json(ResponseUtil.error('评论内容不能为空或仅空格'), { status: 400 });
      }
      const parsedArticleId = parseInt(articleId);
      if (isNaN(parsedArticleId)) {
        return NextResponse.json(ResponseUtil.error('文章ID必须为有效数字'), { status: 400 });
      }
      // 验证父评论ID（可选）
      if (parentCommentId && isNaN(parseInt(parentCommentId))) {
        return NextResponse.json(ResponseUtil.error('父评论ID必须为有效数字'), { status: 400 });
      }
    
    if (!user) {
      return NextResponse.json(ResponseUtil.error('未登录'), { status: 401 });
    }
    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId: parsedArticleId,
        userId: user.id,
        parentCommentId: parentCommentId ? parseInt(parentCommentId) : null // 处理父评论ID
      },
      
      include: { user: { select: { id: true, avatar: true, nickname: true } } }
    });
    return NextResponse.json(ResponseUtil.success(comment));
  } catch (error) {
    console.error('提交评论失败:', error);
    return NextResponse.json(ResponseUtil.error('服务器错误'), { status: 500 });
  }
}