'use client';

import { Tabs } from 'antd';
import { useState } from 'react';
import CourseTab from './components/CourseTab';
import ArticleTab from './components/ArticleTab';
import TaskTab from './components/TaskTab';

const FavoritesPage = () => {
  const [activeKey, setActiveKey] = useState('1');

  const items = [
    {
      key: '1',
      label: '课程',
      children: <CourseTab />,
    },
    {
      key: '2',
      label: '帖子',
      children: <ArticleTab />,
    },
    {
      key: '3',
      label: '任务单',
      children: <TaskTab />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl mb-6">我的收藏</h1>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={items}
        className="bg-white dark:bg-gray-800 rounded-lg p-4"
      />
    </div>
  );
};

export default FavoritesPage; 