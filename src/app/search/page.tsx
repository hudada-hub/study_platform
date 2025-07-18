'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { request } from '@/utils/request';
import Link from 'next/link';
import Image from 'next/image';
import { Spin, Empty, Pagination } from 'antd';
import { FaEye, FaUsers, FaBook } from 'react-icons/fa';

// Wiki 搜索结果接口
interface WikiSearchResult {
  id: number;
  name: string;
  title: string;
  description: string;
  logo: string | null;
  tags: string[];
  hot: number;
  pageCount: number;
  contributorCount: number;
  viewCount: number;
}

interface SearchResponse {
  total: number;
  items: WikiSearchResult[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<WikiSearchResult[]>([]);
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
      const response = await request<SearchResponse>('/wiki/search', {
        method: 'POST',
        body: JSON.stringify({
          keyword:  searchParams.get('q')!.trim(),
          page,
          pageSize
        })
      });

      if (response.code === 0 && response.data) {
        setResults(response.data.items);
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
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
    setCurrentPage(1);
    performSearch(1);
  };

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performSearch(page);
    // 更新 URL，保持搜索参数
    router.push(`/search?q=${encodeURIComponent(keyword)}&page=${page}`);
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
  }, [searchParams,keyword]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
       

        {/* 搜索结果 */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                {results.map((wiki) => (
                  <Link
                    key={wiki.id}
                    href={`/${wiki.name}`}
                    className="block bg-white rounded-lg  hover: transition- p-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                          {wiki.logo ? (
                            <Image
                              src={wiki.logo}
                              alt={wiki.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaBook size={32} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 内容 */}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {wiki.title}
                        </h2>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {wiki.description}
                        </p>
                        
                        {/* 标签 */}
                        {wiki.tags && wiki.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {wiki.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 统计信息 */}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye className="text-gray-400" />
                            {wiki.viewCount} 浏览
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUsers className="text-gray-400" />
                            {wiki.contributorCount} 贡献者
                          </span>
                          <span className="flex items-center gap-1">
                            <FaBook className="text-gray-400" />
                            {wiki.pageCount} 页面
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
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
            <div className="py-12">
              <Empty description="没有找到相关的 Wiki" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 