'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiStar, FiUsers } from 'react-icons/fi';
import { request } from '@/utils/request';
import { CourseLevel } from '@prisma/client';
import { CosImage } from '@/components/common/CosImage';

// 课程类型定义
interface Course {
  id: number;
  title: string;
  coverUrl: string;
  summary: string;
  description: string;
  instructor: string;
  viewCount: number;
  studentCount: number;
  level: CourseLevel;
  totalDuration: number;
  ratingScore: number;
  categoryId: number;
  directionId: number;
}

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
          className={`cursor-pointer ${selectedId === 0 ? 'text-primary' : 'text-gray-600'}`}
          onClick={() => onSelect(0)}
        >
          全部
        </span>
        {items.map(item => (
          <span
            key={item.id}
            className={`cursor-pointer ${selectedId === item.id ? 'text-primary' : 'text-gray-600'}`}
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
          className={`cursor-pointer ${activeTab === tab.key ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </span>
      ))}
    </div>
  );
};

// 课程卡片组件
const CourseCard = ({ course }: { course: Course }) => {
  const getLevelText = (level: CourseLevel) => {
    switch (level) {
      case 'BEGINNER':
        return '初级';
      case 'INTERMEDIATE':
        return '中级';
      case 'ADVANCED':
        return '高级';
      default:
        return '未知';
    }
  };

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE':
        return 'bg-blue-100 text-blue-800';
      case 'ADVANCED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <CosImage
            path={course.coverUrl || '/default-course-cover.jpg'}
            alt={course.title}
            width={200}
            height={300}
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
              {getLevelText(course.level)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg mb-2">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.summary || course.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FiUsers className="mr-1" />
              <span>{course.studentCount}人学习</span>
            </div>
            <div className="flex items-center">
              <FiStar className="mr-1 text-yellow-400" />
              <span>{course.ratingScore.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>{Math.floor(course.totalDuration / 60)}小时</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
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

        const response = await request<Course[]>(`/courses?${params.toString()}`);
        setCourses(response.data);
      } catch (error) {
        console.error('获取课程列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCategory, selectedDirection, selectedLevel, activeTab]);

 

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 筛选区域 */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <FilterItem
            title="方向"
            items={directions}
            selectedId={selectedDirection}
            onSelect={setSelectedDirection}
          />
          <FilterItem
            title="分类"
            items={categories}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <FilterItem
            title="难度"
            items={levels}
            selectedId={selectedLevel}
            onSelect={setSelectedLevel}
          />
        </div>

        {/* 排序和课程列表 */}
        <div className="bg-white rounded-lg p-6">
          <SortTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          {loading ? (
            <div className="text-center py-12">加载中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage; 