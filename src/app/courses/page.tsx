'use client';

import React, { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import { request } from '@/utils/request';
import CourseCard, { Course } from './components/CourseCard';

// 分类类型定义
interface Category {
  id: number;
  name: string;
}

// 方向类型定义
interface Direction {
  id: number;
  name: string;
}

// 分页响应类型
interface PaginatedResponse {
  list: Course[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 筛选项组件
const FilterItem = ({ 
  title, 
  items, 
  selectedId, 
  onSelect 
}: { 
  title: string;
  items: { id: number; name: string; }[];
  selectedId: number;
  onSelect: (id: number) => void;
}) => {
  return (
    <div className="flex items-center py-3 border-b border-gray-100">
      <span className="text-gray-500 w-20">{title}：</span>
      <div className="flex flex-wrap gap-4">
        <span 
          className={`cursor-pointer ${selectedId === 0 ? 'text-cyan-500' : 'text-gray-600'}`}
          onClick={() => onSelect(0)}
        >
          全部
        </span>
        {items.map(item => (
          <span
            key={item.id}
            className={`cursor-pointer ${selectedId === item.id ? 'text-cyan-500' : 'text-gray-600'}`}
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};

// 排序项组件
const SortTabs = ({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { key: 'latest', label: '最新' },
    { key: 'hot', label: '最热' },
    { key: 'rating', label: '好评' },
    { key: 'price', label: '价格' },
  ];

  return (
    <div className="flex gap-6 py-4 border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <span
          key={tab.key}
          className={`cursor-pointer ${activeTab === tab.key ? 'text-cyan-500 border-b-2 border-cyan-500' : 'text-gray-600'}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
};

// 课程页面
const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedDirection, setSelectedDirection] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('latest');
  const [loading, setLoading] = useState(true);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  const levels = [
    { id: 1, name: '初级', value: 'BEGINNER' },
    { id: 2, name: '中级', value: 'INTERMEDIATE' },
    { id: 3, name: '高级', value: 'ADVANCED' },
  ];

  // 获取筛选项数据
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, directionsRes] = await Promise.all([
          request<Category[]>('/courses/categories'),
          request<Direction[]>('/courses/directions')
        ]);
        setCategories(categoriesRes.data);
        setDirections(directionsRes.data);
      } catch (error) {
        console.error('获取筛选项失败:', error);
      }
    };
    fetchFilters();
  }, []);

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('categoryId', selectedCategory.toString());
        if (selectedDirection) params.append('directionId', selectedDirection.toString());
        if (selectedLevel) params.append('level', levels.find(l => l.id === selectedLevel)?.value || '');
        params.append('sort', activeTab);
        params.append('page', currentPage.toString());
        params.append('pageSize', pageSize.toString());

        const response = await request<PaginatedResponse>(`/courses?${params.toString()}`);
        setCourses(response.data.list);
        setTotal(response.data.pagination.total);
      } catch (error) {
        console.error('获取课程列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory, selectedDirection, selectedLevel, activeTab, currentPage]);

  // 处理分页变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理筛选条件变化，重置到第一页
  const handleFilterChange = (type: string, value: number) => {
    setCurrentPage(1);
    switch (type) {
      case 'category':
        setSelectedCategory(value);
        break;
      case 'direction':
        setSelectedDirection(value);
        break;
      case 'level':
        setSelectedLevel(value);
        break;
    }
  };

  // 处理排序变化，重置到第一页
  const handleSortChange = (tab: string) => {
    setCurrentPage(1);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 筛选区域 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <FilterItem
            title="方向"
            items={directions}
            selectedId={selectedDirection}
            onSelect={(id) => handleFilterChange('direction', id)}
          />
          <FilterItem
            title="分类"
            items={categories}
            selectedId={selectedCategory}
            onSelect={(id) => handleFilterChange('category', id)}
          />
          <FilterItem
            title="难度"
            items={levels}
            selectedId={selectedLevel}
            onSelect={(id) => handleFilterChange('level', id)}
          />
        </div>

        {/* 排序和课程列表 */}
        <div className="bg-white rounded-lg p-6">
          <SortTabs activeTab={activeTab} onTabChange={handleSortChange} />
          
          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              
              {/* 分页组件 */}
              {total > pageSize && (
                <div className="flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;