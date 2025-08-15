'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

interface ForumLayoutProps {
  children: React.ReactNode;
}

const ForumLayout: React.FC<ForumLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('posts');

  // 根据当前路径设置激活的标签页
  useEffect(() => {
    if (pathname.includes('/posts')) {
      setActiveTab('posts');
    } else if (pathname.includes('/replies')) {
      setActiveTab('replies');
    } else {
      // 默认进入我的帖子页面
      setActiveTab('posts');
      router.push('/user/forum/posts');
    }
  }, [pathname, router]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'posts') {
      router.push('/user/forum/posts');
    } else if (key === 'replies') {
      router.push('/user/forum/replies');
    }
  };

  const tabItems = [
    {
      key: 'posts',
      label: '我的帖子',
    },
    {
      key: 'replies',
      label: '我的回复',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 页面标题 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">论坛管理</h1>
          </div>

          {/* Tab导航 */}
          <div className="px-6 pt-4">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              className="forum-tabs"
            />
          </div>

          {/* 子页面内容 */}
          <div className="p-6 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumLayout; 