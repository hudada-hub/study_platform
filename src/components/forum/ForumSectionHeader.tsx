'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit3, FiStar, FiUsers, FiEye, FiMessageSquare } from 'react-icons/fi';
import { ForumSection } from '@/types/forum';
import { request } from '@/utils/request';

interface ForumSectionHeaderProps {
  section: ForumSection;
  activeTab: 'posts' | 'subsections';
  onTabChange: (tab: 'posts' | 'subsections') => void;
  selectedSubsection?: string | null;
  onSubsectionFilter?: (subsectionId: string | null) => void;
}

const ForumSectionHeader: React.FC<ForumSectionHeaderProps> = ({ 
  section, 
  activeTab, 
  onTabChange,
  selectedSubsection,
  onSubsectionFilter
}) => {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(section.favoriteCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  // 检查当前用户是否已收藏该板块
  useEffect(() => {
    checkFavoriteStatus();
  }, [section.id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await request(`/forum/sections/${section.id}/favorite/status`, {
        method: 'GET',
      });
      setIsFavorited((response.data as { isFavorited: boolean }).isFavorited);
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  const handleFavorite = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isFavorited) {
        // 取消收藏
        await request(`/forum/sections/${section.id}/favorite`, {
          method: 'DELETE',
        });
        setIsFavorited(false);
        setFavoriteCount(prev => Math.max(0, prev - 1));
      } else {
        // 添加收藏
        await request(`/forum/sections/${section.id}/favorite`, {
          method: 'POST',
        });
        setIsFavorited(true);
        setFavoriteCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPost = () => {
    router.push(`/forum/sections/${section.id}/post`);
  };

  return (
    <div className="border-b border-gray-200">
      {/* 板块信息 */}
      <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              {section.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {section.description}
            </p>
            
            {/* 统计信息 */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiUsers className="w-4 h-4" />
                <span>版主: {section.moderator?.nickname || '管理员'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiMessageSquare className="w-4 h-4" />
                <span>帖子: {section.postCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span>今日: {section.postCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiStar className="w-4 h-4" />
                <span>收藏: {favoriteCount}</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleFavorite}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isFavorited
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-cyan-500 text-white hover:bg-cyan-600'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiStar className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              <span>{isFavorited ? '已收藏' : '收藏'}</span>
            </button>
            <button 
              onClick={handleNewPost}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>发新帖</span>
            </button>
          </div>
        </div>

        {/* 公告 */}
        {section.announcement && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>公告:</strong> {section.announcement}
            </div>
          </div>
        )}
      </div>

      {/* 选项卡和子版块 */}
      <div className="px-6 py-3 bg-white border-b border-gray-200">
        {/* 选项卡 */}
      
        
        {/* 子版块列表 */}
        {section.children && section.children.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSubsectionFilter?.(null)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                !selectedSubsection
                  ? 'bg-cyan-500 text-white border border-cyan-600'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              全部
            </button>
            {section.children.map((child) => (
              <button
                key={child.id}
                onClick={() => onSubsectionFilter?.(child.id.toString())}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                  selectedSubsection === child.id.toString()
                    ? 'bg-cyan-500 text-white border border-cyan-600'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                }`}
              >
                <span>{child.name}</span>
                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  {(child as any).postCount || 0}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumSectionHeader; 