'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Card, Tag, Space, message } from 'antd';
import { EyeOutlined, UserOutlined, ClockCircleOutlined, StarOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import Link from 'next/link';
import { Course, ApiResponse, PaginatedResponse } from '@/types/api';

const { TabPane } = Tabs;

const CourseSection: React.FC = () => {
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLatestCourses = async () => {
    try {
      const response = await request<PaginatedResponse<Course>>('/courses?page=1&pageSize=10&sort=createdAt');
      if (ResponseUtil.success(response)) {
        setLatestCourses(response.data.list || []);
      }
    } catch (error) {
      console.error('获取最新课程失败:', error);
    }
  };

  const fetchPopularCourses = async () => {
    try {
      const response = await request<PaginatedResponse<Course>>('/courses?page=1&pageSize=10&sort=viewCount');
      if (ResponseUtil.success(response)) {
        setPopularCourses(response.data.list || []);
      }
    } catch (error) {
      console.error('获取热门课程失败:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLatestCourses(), fetchPopularCourses()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const getLevelTag = (level: string) => {
    const levelMap: Record<string, { color: string; text: string }> = {
      BEGINNER: { color: 'green', text: '入门' },
      ELEMENTARY: { color: 'cyan', text: '初级' },
      INTERMEDIATE: { color: 'blue', text: '中级' },
      ADVANCED: { color: 'purple', text: '高级' },
      EXPERT: { color: 'red', text: '专家' },
    };
    const config = levelMap[level] || { color: 'default', text: level };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN');
  };

  const renderCourseCard = (course: Course) => (
    <Link key={course.id} href={`/courses/${course.id}`}>
      <Card
        hoverable
        className="h-full transition-all duration-300 hover:shadow-lg"
        cover={
          <div className="relative h-48 overflow-hidden">
            <img
              alt={course.title}
              src={course.coverUrl}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Tag color="blue">{course.category.name}</Tag>
            {getLevelTag(course.level)}
          </div>
          <h3 className="text-lg font-normal text-gray-900 line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.summary}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <UserOutlined className="mr-1" />
              {course.instructor}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <EyeOutlined className="mr-1" />
                {course.viewCount}
              </div>
              <div className="flex items-center">
                <StarOutlined className="mr-1" />
                {course.studentCount}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  const renderCourseGrid = (courses: Course[]) => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {courses.map(renderCourseCard)}
    </div>
  );

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal text-gray-900">精品课程</h2>
        <Link 
          href="/courses" 
          className="text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          查看更多 →
        </Link>
      </div>
      
      <Tabs 
        defaultActiveKey="latest" 
        className="course-tabs"
        items={[
          {
            key: 'latest',
            label: '最新课程',
            children: (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderCourseGrid(latestCourses)
                )}
              </div>
            ),
          },
          {
            key: 'popular',
            label: '热门课程',
            children: (
              <div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="flex justify-between">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="flex gap-4">
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                              <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderCourseGrid(popularCourses)
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CourseSection; 