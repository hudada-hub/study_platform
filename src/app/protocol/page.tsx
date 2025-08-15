'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { request } from '@/utils/request';
import { Card, Empty, Pagination, Skeleton, Tag } from 'antd';
import { EyeIcon, HeartIcon, ChatBubbleLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import UserAvatar from '@/app/components/common/UserAvatar';
import { ResponseCode } from '@/utils/response';

interface Category {
  id: number;
  name: string;
  parent: {
    id: number;
    name: string;
  } | null;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  coverUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  category: Category;
  author: {
    id: number;
    username: string;
    avatar: string;
  };
}

interface ArticleListResponse {
  list: Article[];
  pagination: {
    total: number;
  };
}

// 创建一个内部组件来处理搜索参数相关的逻辑
function ArticlesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // 获取文章列表
  const fetchArticles = async (page: number) => {
    setLoading(true);
    try {
      const categoryId = searchParams.get('categoryId');
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (categoryId) {
        params.append('categoryId', categoryId);
      }
      const res = await request<ArticleListResponse>(`/articles?${params.toString()}`);
      if (res.code === ResponseCode.SUCCESS && res.data) {
        setArticles(res.data.list);
        setTotal(res.data.pagination.total);
      }
    } catch (error) {
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchArticles(page);
  }, [searchParams]);

  // 处理分页变化
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/articles?${params.toString()}`);
  };

  // 跳转到文章详情
  const handleArticleClick = (article: Article) => {
    router.push(`/articles/${article.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[1280px] mx-auto px-4">
        {/* 文章列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="w-full">
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <Empty description="暂无文章" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <Card
                  key={article.id}
                  hoverable
                  cover={
                    article.coverUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={article.title}
                          src={article.coverUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )
                  }
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <UserAvatar avatarUrl={article.author.avatar} size="sm" />
                    <span className="text-sm text-gray-600">{article.author.username}</span>
                  </div>
                  <Card.Meta
                    title={article.title}
                    description={
                      <div>
                        <p className="text-gray-600 line-clamp-2 mb-2">{article.summary}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <EyeIcon className="w-4 h-4" />
                              {article.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <HeartIcon className="w-4 h-4" />
                              {article.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <ChatBubbleLeftIcon className="w-4 h-4" />
                              {article.commentCount}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {dayjs(article.createdAt).format('MM-DD')}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {total > pageSize && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 导出主组件，使用 Suspense 包裹 ArticlesList
export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className="w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-full">
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
          ))}
        </div>
      </div>
    }>
      <ArticlesList />
    </Suspense>
  );
}