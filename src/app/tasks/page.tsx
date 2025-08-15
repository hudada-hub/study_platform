'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Pagination, Card, Tag, Space } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import qs from 'qs';

const { Option } = Select;

interface TaskCategory {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

interface Task {
  id: number;
  title: string;
  content: string;
  status: string;
  points: number;
  viewCount: number;
  createdAt: string;
  category: TaskCategory;
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  applications: Array<{
    id: number;
    applicant: {
      id: number;
      nickname: string;
    };
  }>;
}

const TaskPage: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [categories, setCategories] = useState<TaskCategory[]>([]);

  // 获取任务分类
  const fetchCategories = async () => {
    try {
      const response = await request('/tasks/categories',{
        method:"GET"
      });
      if (ResponseUtil.success(response)) {
        setCategories(response.data as TaskCategory[]);
      }
    } catch (error) {
      console.error('获取任务分类失败:', error);
    }
  };

  // 获取任务列表
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize,
        keyword: searchKeyword,
        categoryId: selectedCategory,
        status: selectedStatus, // 新增状态筛选参数
        sortBy,
        sortOrder,
      };
      
      const queryStr = qs.stringify(params, { skipNulls: true });
      console.log(queryStr, 'queryStr');
      const response = await request(`/tasks?${queryStr}`, {
        method: 'GET',
      });
      if (ResponseUtil.success(response)) {
        setTasks((response.data as {list:Task[],total:number}).list);
        setTotal((response.data as {list:Task[],total:number}).total);
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [currentPage, pageSize, searchKeyword, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  // 处理分类筛选
  const handleCategoryChange = (value: number | null) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // 处理状态筛选
  const handleStatusChange = (value: string | null) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  // 处理排序
  const handleSortChange = (key: string) => {
    const [field, order] = key.split('-');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    setCurrentPage(1);
  };

  // 排序选项
  const sortOptions = [
    { key: 'createdAt-desc', label: '最新发布' },
    { key: 'createdAt-asc', label: '最早发布' },
    { key: 'points-desc', label: '积分最高' },
    { key: 'points-asc', label: '积分最低' },
    { key: 'viewCount-desc', label: '浏览最多' },
    { key: 'viewCount-asc', label: '浏览最少' },
  ];

  // 获取当前排序的显示文本
  const getCurrentSortLabel = () => {
    const currentSort = `${sortBy}-${sortOrder}`;
    const option = sortOptions.find(opt => opt.key === currentSort);
    return option ? option.label : '排序';
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      PENDING: { color: 'orange', text: '待审核' },
      APPROVED: { color: 'blue', text: '已通过' },
      REJECTED: { color: 'red', text: '已拒绝' },
      IN_PROGRESS: { color: 'green', text: '执行中' },
      COMPLETED: { color: 'purple', text: '已完成' },
      ADMIN_CONFIRMED: { color: 'cyan', text: '管理员已确认完成' },
      PUBLISHER_CONFIRMED: { color: 'green', text: '发布者已确认完成' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 格式化时间
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
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">任务大厅</h1>
          <p className="text-gray-600">发布任务、接单赚钱，让技能变现</p>
        </div>

        {/* 筛选和操作栏 */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm space-y-4">
          {/* 第一排：搜索和发布任务 */}
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="搜索任务标题或内容"
                prefix={loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div> : <SearchOutlined />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
                allowClear
                disabled={loading}
              />
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => router.push('/tasks/publish')}
              disabled={loading}
            >
              发布任务
            </Button>
            </div>

          {/* 第二排：任务分类 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">任务分类:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                全部
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 第三排：任务状态 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">任务状态:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleStatusChange(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatus === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                全部
              </button>
              <button
                onClick={() => handleStatusChange('APPROVED')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatus === 'APPROVED'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                发布中任务
              </button>
              <button
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatus === 'IN_PROGRESS'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                执行中任务
              </button>
              <button
                onClick={() => handleStatusChange('COMPLETED')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatus === 'COMPLETED'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                已完成任务
              </button>
              <button
                onClick={() => handleStatusChange('ADMIN_CONFIRMED')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedStatus === 'ADMIN_CONFIRMED'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                管理员已确认完成任务
              </button>
            </div>
          </div>

          {/* 第四排：排序 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">排序:</span>
            <div className="flex items-center gap-2">
              {sortOptions.map(option => {
                const [field, order] = option.key.split('-');
                const isActive = sortBy === field && sortOrder === order;
                return (
                  <button
                    key={option.key}
                    onClick={() => handleSortChange(option.key)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            // 加载状态 - 显示骨架屏
            <div className="space-y-4 p-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex space-x-2">
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="flex space-x-6">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // 正常任务列表
            <>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      {/* 左侧内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag color="blue" className="text-xs">
                            {task.category.name}
                          </Tag>
                          {getStatusTag(task.status)}
                        </div>
                        <h3 className="text-lg font-normal text-gray-900 mb-2 line-clamp-1">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {task.content.replace(/<[^>]*>/g, '')}
                        </p>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center">
                            <UserOutlined className="mr-1" />
                            {task.author.nickname}
                          </div>
                          <div className="flex items-center">
                            <ClockCircleOutlined className="mr-1" />
                            {formatTime(task.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <EyeOutlined className="mr-1" />
                            {task.viewCount} 浏览
                          </div>
                          {task.applications.length > 0 && (
                            <div className="text-cyan-600">
                              已有 {task.applications.length} 人报名
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 右侧积分 */}
                      <div className="flex-shrink-0 ml-6 text-right">
                        <div className="text-xl font-medium text-orange-500 mb-1">
                          {task.points}
                        </div>
                        <div className="text-xs text-gray-500">积分</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* 空状态 */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">暂无任务</div>
            <p className="text-gray-500">试试调整筛选条件或发布新任务</p>
          </div>
        )}

        {/* 分页 */}
        {total > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskPage; 