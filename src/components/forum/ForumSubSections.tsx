'use client';

import React, { useEffect, useState } from 'react';
import { FiMessageSquare, FiUsers, FiClock } from 'react-icons/fi';
import { ForumSection } from '@/types/forum';
import { request } from '@/utils/request';

interface ForumSubSectionsProps {
  sectionId: string;
  loading: boolean;
}

const ForumSubSections: React.FC<ForumSubSectionsProps> = ({ sectionId, loading }) => {
  const [subSections, setSubSections] = useState<ForumSection[]>([]);

  useEffect(() => {
    if (sectionId) {
      fetchSubSections();
    }
  }, [sectionId]);

  const fetchSubSections = async () => {
    try {
      const response = await request(`/forum/sections/${sectionId}/subsections`,{
        method: 'GET',
      });
      setSubSections((response.data as ForumSection[]) || []);
    } catch (error) {
      console.error('获取子版块失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (subSections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">暂无子版块</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subSections.map((subSection) => (
        <div key={subSection.id} className="border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-200">
          <div className="flex items-center space-x-4 p-4">
            {/* 子版块图标 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* 子版块信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {subSection.name}
                </h3>
                {subSection.postCount > 0 && (
                  <span className="text-sm text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                    今日:{subSection.postCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {subSection.description}
              </p>
            </div>

            {/* 统计信息 */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm text-gray-500 mb-1">
                {subSection.postCount} 帖子
              </div>
              <div className="text-xs text-gray-400">
                {new Date(subSection.lastPostAt).toLocaleDateString('zh-CN')} {subSection.moderator?.nickname || '管理员'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumSubSections; 