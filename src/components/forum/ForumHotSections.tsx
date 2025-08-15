'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { request } from '@/utils/request';

interface HotSection {
  id: string;
  title: string;
  topicCount: number;
  icon: React.ReactNode;
  link?: string;
}

interface ForumHotSectionsProps {
  sections?: HotSection[];
}

/**
 * 热门版块组件
 */
const ForumHotSections: React.FC<ForumHotSectionsProps> = ({ sections }) => {
  const [hotSections, setHotSections] = useState<HotSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotSections();
  }, []);

  const fetchHotSections = async () => {
    try {
      setLoading(true);
      const response = await request('/forum/sections/hot', {
        method: 'GET',
      });
      
      if (response.code === 0 && response.data) {
        const data = response.data as { sections: any[] };
        const sections = data.sections || [];
        
        // 转换数据格式
        const transformedSections: HotSection[] = sections.map((section, index) => ({
          id: section.id.toString(),
          title: section.name,
          topicCount: section.postCount,
          link: `/forum/sections/${section.id}`,
          icon: getSectionIcon(index),
        }));
        
        setHotSections(transformedSections);
      }
    } catch (error) {
      console.error('获取热门板块失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据索引获取不同的图标
  const getSectionIcon = (index: number) => {
    const icons = [
      <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>,
      <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>,
      <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg key="5" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>,
    ];
    
    return icons[index % icons.length];
  };

  const displaySections = sections || hotSections;

  return (
    <div className="bg-white rounded-lg p-6">
      {/* 标题 */}
      <div className="mb-4">
        <h3 className="text-base text-gray-900">
          <span className="text-blue-500">//</span> 热门版块
        </h3>
      </div>

      {/* 版块列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            加载中...
          </div>
        ) : displaySections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无热门版块
          </div>
        ) : (
          displaySections.map((section) => {
            const content = (
              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors rounded-lg">
                {/* 图标 */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="text-orange-400">
                    {section.icon}
                  </div>
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 mb-1">
                    {section.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    主题: {section.topicCount}
                  </div>
                </div>
              </div>
            );

            if (section.link) {
              return (
                <Link key={section.id} href={section.link} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <div key={section.id}>
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ForumHotSections; 