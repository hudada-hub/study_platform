'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

interface TasksLayoutProps {
  children: React.ReactNode;
}

const TasksLayout: React.FC<TasksLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('published');
  const hasInitializedRef = useRef(false); // 防止重复初始化

  // 根据当前路径设置激活的标签页
  useEffect(() => {
    if (pathname.includes('/published')) {
      setActiveTab('published');
    } else if (pathname.includes('/accepted')) {
      setActiveTab('accepted');
    } else if (!hasInitializedRef.current) {
      // 只在首次加载时设置默认标签页，不自动跳转
      setActiveTab('published');
      hasInitializedRef.current = true;
    }
  }, [pathname]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'published') {
      router.push('/user/tasks/published');
    } else if (key === 'accepted') {
      router.push('/user/tasks/accepted');
    }
  };

  const tabItems = [
    {
      key: 'published',
      label: '发布的任务',
    },
    {
      key: 'accepted',
      label: '接受的任务',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* 页面标题 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">任务管理</h1>
          </div>

          {/* Tab导航 */}
          <div className="px-6 pt-4">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              className="tasks-tabs"
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

export default TasksLayout; 