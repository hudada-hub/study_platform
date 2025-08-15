'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Card, Tag, Avatar, Space } from 'antd';
import { EyeOutlined, UserOutlined, ClockCircleOutlined, DollarOutlined, FireOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  content: string;
  points: number;
  viewCount: number;
  applicationCount: number;
  createdAt: string;
  status: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

const TaskSection: React.FC = () => {
  const [latestTasks, setLatestTasks] = useState<Task[]>([]);
  const [popularTasks, setPopularTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLatestTasks = async () => {
    try {
      const response = await request('/tasks?page=1&pageSize=6&sortBy=createdAt');
      if (ResponseUtil.success(response)) {
        setLatestTasks((response.data as any).list || []);
      }
    } catch (error) {
      console.error('获取最新任务失败:', error);
    }
  };

  const fetchPopularTasks = async () => {
    try {
      const response = await request('/tasks?page=1&pageSize=6&sortBy=viewCount');
      if (ResponseUtil.success(response)) {
        setPopularTasks((response.data as any).list || []);
      }
    } catch (error) {
      console.error('获取热门任务失败:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLatestTasks(), fetchPopularTasks()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'orange', text: '待审核' },
      APPROVED: { color: 'blue', text: '已通过' },
      REJECTED: { color: 'red', text: '已拒绝' },
      IN_PROGRESS: { color: 'green', text: '执行中' },
      COMPLETED: { color: 'purple', text: '已完成' },
      ADMIN_CONFIRMED: { color: 'cyan', text: '管理员已确认完成' },
      PUBLISHER_CONFIRMED: { color: 'green', text: '发布者已确认完成' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const renderTaskCard = (task: Task) => (
    <Link key={task.id} href={`/tasks/${task.id}`}>
      <Card
        hoverable
        className="h-full transition-all duration-300 hover:shadow-lg"
        bodyStyle={{ padding: '16px' }}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Tag color="blue">{task.category.name}</Tag>
            {getStatusTag(task.status)}
          </div>
          <h3 className="text-lg font-normal text-gray-900 line-clamp-2 leading-tight">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {task.content.replace(/<[^>]*>/g, '')}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Avatar 
                  src={task.author.avatar} 
                  size={20}
                  className="mr-1"
                />
                {task.author.nickname}
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-1" />
                {formatTime(task.createdAt)}
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center">
                <EyeOutlined className="mr-1" />
                {task.viewCount}
              </div>
              <div className="flex items-center">
                <UserOutlined className="mr-1" />
                {task.applicationCount}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-orange-500 font-medium text-lg">
              <DollarOutlined className="mr-1" />
              {task.points} 积分
            </div>
            <div className="text-sm text-gray-500">
              悬赏金额
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  const renderTaskGrid = (tasks: Task[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map(renderTaskCard)}
    </div>
  );

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal text-gray-900">任务广场</h2>
        <Link 
          href="/tasks" 
          className="text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          查看更多 →
        </Link>
      </div>
      
      <Tabs 
        defaultActiveKey="latest" 
        className="task-tabs"
        items={[
          {
            key: 'latest',
            label: '最新任务',
            children: (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="flex justify-between">
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderTaskGrid(latestTasks)
                )}
              </div>
            ),
          },
          {
            key: 'popular',
            label: '热门任务',
            children: (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="flex justify-between">
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderTaskGrid(popularTasks)
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default TaskSection; 