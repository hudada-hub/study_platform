'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { request } from '@/utils/request';
import Link from 'next/link';
import { Spin, Empty, Pagination, Input, Button } from 'antd';
import { SearchOutlined, EyeOutlined, MessageOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';
import { ForumPost } from '@/types/forum';

interface PostSearchResponse {
  total: number;
  list: ForumPost[];
}

export default function ForumSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<ForumPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // 执行搜索
  const performSearch = async (page: number = 1) => {
    if (!keyword.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      
      const response = await request<PostSearchResponse>(`/forum/posts/search?${params.toString()}`, {
        method: 'GET'
      });

      if (response.code === 0 && response.data) {
        setResults(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/forum/search?q=${encodeURIComponent(keyword)}`);
    setCurrentPage(1);
    performSearch(1);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(page);
    router.push(`/forum/search?q=${encodeURIComponent(keyword)}&page=${page}`);
  };

  // 初始加载和 URL 参数变化时执行搜索
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    const searchKeyword = searchParams.get('q');
    if (searchKeyword) {
      setKeyword(searchKeyword);
      setCurrentPage(page);
      performSearch(page);
    }
  }, [searchParams]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 搜索表单 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-xl font-medium text-gray-900 mb-4">搜索帖子</h1>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
              size="large"
              placeholder="请输入搜索关键词"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              prefix={<SearchOutlined className="text-gray-400" />}
              className="flex-1"
            />
            <Button 
              type="primary" 
              size="large" 
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
          </form>
        </div>

        {/* 搜索结果 */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="text-sm text-gray-500 mb-4">
                找到 {total} 个相关帖子
              </div>
              <div className="space-y-4">
                {results.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link 
                            href={`/forum/posts/${post.id}`}
                            className="text-lg font-medium text-gray-900 hover:text-cyan-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                          {post.isTop && (
                            <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded">置顶</span>
                          )}
                          {post.isEssence && (
                            <span className="px-2 py-1 bg-yellow-50 text-yellow-600 text-xs rounded">精华</span>
                          )}
                          {post.isHot && (
                            <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">热门</span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <UserOutlined />
                            <Link 
                              href={`/user/${post.author.id}`}
                              className="hover:text-cyan-600 transition-colors"
                            >
                              {post.author.nickname}
                            </Link>
                          </div>
                          <div className="flex items-center gap-1">
                            <EyeOutlined />
                            {post.viewCount} 浏览
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageOutlined />
                            {post.commentCount} 回复
                          </div>
                          <div className="flex items-center gap-1">
                            <LikeOutlined />
                            {post.likeCount} 点赞
                          </div>
                          <span>{formatTime(post.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <Link 
                          href={`/forum/sections/${post.section.id}`}
                          className="text-xs text-cyan-600 hover:text-cyan-700 transition-colors"
                        >
                          {post.section.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {total > pageSize && (
                <div className="flex justify-center mt-8">
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
          ) : keyword && !loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <Empty description="没有找到相关的帖子" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 