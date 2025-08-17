'use client';

import React, { useState } from 'react';

interface ForumTabsProps {
  activeTab: 'latest' | 'recommended';
  onTabChange: (tab: 'latest' | 'recommended') => void;
}

/**
 * 论坛标签页组件
 */
const ForumTabs: React.FC<ForumTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabChange('latest')}
        className={`px-6 py-3 text-sm transition-colors ${
          activeTab === 'latest'
            ? 'text-cyan-600 border-b-2 border-cyan-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        最新文章
      </button>
      <button
        onClick={() => onTabChange('recommended')}
        className={`px-6 py-3 text-sm transition-colors ${
          activeTab === 'recommended'
            ? 'text-cyan-600 border-b-2 border-cyan-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        社区推荐
      </button>
    </div>
  );
};

export default ForumTabs; 