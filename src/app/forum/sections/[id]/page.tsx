'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Pagination } from 'antd';
import { request } from '@/utils/request';
import { ForumSection, ForumPost } from '@/types/forum';
import ForumSectionHeader from '@/components/forum/ForumSectionHeader';
import ForumSubSections from '@/components/forum/ForumSubSections';
import ForumPostsList from '@/components/forum/ForumPostsList';
import ForumMenu from '@/components/forum/ForumMenu';

export default function ForumSectionPage() {
  const params = useParams();
  const sectionId = params.id as string;
  
  const [section, setSection] = useState<ForumSection | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<'posts' | 'subsections'>('posts');
  // 添加选中的子版块状态
  const [selectedSubsection, setSelectedSubsection] = useState<string | null>(null);
  // 添加排序状态
  const [currentSort, setCurrentSort] = useState('latest'); // latest, hot, popular, essence

  useEffect(() => {
    if (sectionId) {
      fetchSectionData();
      fetchPosts();
    }
  }, [sectionId, currentPage, selectedSubsection, currentSort]); // 添加currentSort依赖

  const fetchSectionData = async () => {
    try {
      const response = await request(`/forum/sections/${sectionId}`, {
        method: 'GET',
      });
      setSection((response.data as ForumSection));
    } catch (error) {
      console.error('获取板块信息失败:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // 构建查询参数，支持子版块筛选和排序
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sort: currentSort, // 添加排序参数
      });
      
      if (selectedSubsection) {
        params.append('subsectionId', selectedSubsection);
      }
      
      const response = await request(`/forum/sections/${sectionId}/posts?${params.toString()}`, {
        method: 'GET',
      });
      if (response.code === 0 && response.data) {
        const data = response.data as { posts: ForumPost[]; totalPosts: number; totalPages: number };
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('获取帖子列表失败:', response.message);
        setPosts([]);
        setTotalPosts(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      setPosts([]);
      setTotalPosts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  // 处理子版块筛选
  const handleSubsectionFilter = (subsectionId: string | null) => {
    setSelectedSubsection(subsectionId);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理排序变化
  const handleSortChange = (sortType: string) => {
    setCurrentSort(sortType);
    setCurrentPage(1); // 重置到第一页
  };

  if (!section && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">板块不存在</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <ForumMenu />
          
          {section && (
            <ForumSectionHeader 
              section={section} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedSubsection={selectedSubsection}
              onSubsectionFilter={handleSubsectionFilter}
            />
          )}

          <div className="p-6">
            {activeTab === 'posts' ? (
              <>
                <ForumPostsList 
                  posts={posts}
                  loading={loading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onSortChange={handleSortChange}
                  sectionId={sectionId}
                  currentUser={null}
                />
                
                {/* 分页组件 */}
                {!loading && totalPosts > 0 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      current={currentPage}
                      total={totalPosts}
                      pageSize={pageSize}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total, range) => 
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                      }
                      onChange={handlePageChange}
                      onShowSizeChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <ForumSubSections 
                sectionId={sectionId}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 