'use client';

import Link from 'next/link';
import { FiClock, FiStar, FiUsers } from 'react-icons/fi';
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

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
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
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="relative h-[170px]">
          <CosImage
            path={course.coverUrl || '/default-course-cover.jpg'}
            alt={course.title}
            width={200}
            height={300}
            className="object-cover w-[270px] h-[170px]"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(course.level)}`}>
              {getLevelText(course.level)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg mb-2">{course.title}</h3>
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

export default CourseCard;
export type { Course, CourseCardProps }; 