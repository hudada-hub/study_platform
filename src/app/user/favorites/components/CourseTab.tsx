'use client';

import { useEffect, useState } from 'react';
import { Empty, Pagination, Spin } from 'antd';
import Link from 'next/link';
import { request } from '@/utils/request';
import { FaHeart, FaComment, FaThumbsUp } from 'react-icons/fa';
import Image from 'next/image';
import { CosImage } from '@/components/common/CosImage';

interface Course {
  id: number;
  title: string;
  coverUrl: string;
  description: string;
  favoriteCount: number;
  likeCount: number;
  commentCount: number;
  price: number;
}

interface PaginatedResponse {
  items: Course[];
  total: number;
  page: number;
  pageSize: number;
}

const CourseTab = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchCourses = async (page: number) => {
    try {
      setLoading(true);
      const response = await request<PaginatedResponse>(`/user/favorites/courses?page=${page}&pageSize=${pageSize}`);
      setCourses(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('获取收藏课程失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Empty
        description="暂无收藏的课程"
        className="py-8"
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <CosImage
                path={course.coverUrl}
                alt={course.title}
                width={300}
                height={200}
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <FaHeart className="mr-1 text-orange-500" />
                    {course.favoriteCount}
                  </span>
                  <span className="flex items-center">
                    <FaThumbsUp className="mr-1" />
                    {course.likeCount}
                  </span>
                  <span className="flex items-center">
                    <FaComment className="mr-1" />
                    {course.commentCount}
                  </span>
                </div>
                <span className="text-orange-500">
                  {course.price > 0 ? `¥${course.price}` : '免费'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CourseTab; 