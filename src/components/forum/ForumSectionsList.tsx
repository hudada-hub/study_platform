'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiBook, FiUsers, FiMessageSquare, FiStar, FiFileText, FiVideo, FiDownload, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { ForumCategory } from '@/types/forum';

interface ForumSectionsListProps {
  categories: ForumCategory[];
  loading: boolean;
}

// 板块图标映射
const getSectionIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('教程') || lowerName.includes('书籍')) {
    return <FiBook className="w-6 h-6 text-orange-500" />;
  }
  if (lowerName.includes('工具') || lowerName.includes('万剑')) {
    return <FiStar className="w-6 h-6 text-orange-500" />;
  }
  if (lowerName.includes('ppt') || lowerName.includes('直播')) {
    return <FiVideo className="w-6 h-6 text-orange-500" />;
  }
  if (lowerName.includes('资源') || lowerName.includes('分享')) {
    return <FiDownload className="w-6 h-6 text-orange-500" />;
  }
  if (lowerName.includes('文章') || lowerName.includes('精选')) {
    return <FiFileText className="w-6 h-6 text-orange-500" />;
  }
  return <FiMessageSquare className="w-6 h-6 text-orange-500" />;
};

const ForumSectionsList: React.FC<ForumSectionsListProps> = ({ categories, loading }) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (categoryId: number) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(categoryId)) {
      newCollapsed.delete(categoryId);
    } else {
      newCollapsed.add(categoryId);
    }
    setCollapsedCategories(newCollapsed);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            {[...Array(4)].map((_, sectionIndex) => (
              <div key={sectionIndex} className="animate-pulse">
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
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-base">暂无论坛板块</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const isCollapsed = collapsedCategories.has(category.id);
        const moderatorName = category.sections[0]?.moderator?.nickname || '管理员';
        
        return (
          <div key={category.id} className="space-y-4">
            {/* 分类标题 */}
            <div className="border-b border-gray-200 pb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">{category.name}</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-cyan-600">版主: {moderatorName}</span>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    {isCollapsed ? (
                      <FiChevronRight className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 该分类下的板块列表 */}
            {!isCollapsed && (
              <div className="space-y-4">
                {category.sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-200">
                    <div className="flex items-center space-x-4 p-4">
                      {/* 板块图标 */}
                      <div className="flex-shrink-0">
                        {getSectionIcon(section.name)}
                      </div>

                      {/* 板块信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link 
                            href={`/forum/sections/${section.id}`}
                            className="text-base font-medium text-gray-900 truncate hover:text-cyan-600 transition-colors duration-200"
                          >
                            {section.name}
                          </Link>
                          {section.postCount > 0 && (
                                                      <span className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                            今日:{section.postCount}
                          </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {section.description}
                        </p>
                      </div>

                      {/* 统计信息 */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-xs text-gray-500 mb-1">
                          {section.postCount}/{section.postCount} 帖子
                        </div>
                        <div className="text-xs text-gray-400 mb-1">
                          {new Date(section.lastPostAt).toLocaleDateString('zh-CN')} {section.moderator?.nickname || '管理员'}
                        </div>
                        <div className="text-xs text-cyan-600">
                          版主: {section.moderator?.nickname || '管理员'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ForumSectionsList; 