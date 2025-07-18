import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ResponseUtil } from '@/utils/response';
import { ArticleStatus } from '@prisma/client';

// GET 请求处理程序
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 获取文章 ID
    const articleId = parseInt((await params).id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { code: 400, message: '无效的文章 ID' },
        { status: 400 }
      );
    }

    // 查询文章详情
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
        status: ArticleStatus.PUBLISHED
      },
      select: {
        id: true,
        title: true,
        content: true,
        summary: true,
        coverUrl: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            parent: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        comments: {
          where: {
            isDeleted: false,
            parentCommentId: null // 只获取顶级评论
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            likeCount: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            },
            replies: {
              where: {
                isDeleted: false
              },
              select: {
                id: true,
                content: true,
                createdAt: true,
                likeCount: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true
                  }
                }
              },
              orderBy: {
                createdAt: 'asc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!article) {
      return NextResponse.json(ResponseUtil.error('文章不存在'));
    }

    // 更新阅读量
    await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // 格式化返回数据
    const formattedArticle = {
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      viewCount: article.viewCount + 1, // 加上刚刚增加的阅读量
      categoryId: article.category.id,
      categoryName: article.category.name,
    };

    return NextResponse.json(ResponseUtil.success(formattedArticle));
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return NextResponse.json(ResponseUtil.error('获取文章详情失败'));
  }
} 