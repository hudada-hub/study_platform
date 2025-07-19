'use client';
import { useState, useEffect } from 'react';
import { Button, Space, Popconfirm, message, Tag } from 'antd';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AddCourseModal from './components/AddCourseModal';
import { useCourses } from './hooks/useCourses';
import { request } from '@/utils/request';
import ChapterModal from './components/ChapterModal';
import { CosImage } from '@/components/common/CosImage';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const levelColors = {
  BEGINNER: 'green',
  ELEMENTARY: 'cyan',
  INTERMEDIATE: 'blue',
  ADVANCED: 'purple',
  EXPERT: 'red',
};

const levelLabels = {
  BEGINNER: '入门',
  ELEMENTARY: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
  EXPERT: '专家',
};

export default function CoursesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const { courses, loading, error, refreshCourses } = useCourses();
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const showModal = () => {
    setEditingCourse(null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    refreshCourses();
  };

  const handleEditChapter = (record: any) => {
    setSelectedCourseId(record.id);
    setIsChapterModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingCourse(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await request(`/courses/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      refreshCourses();
    } catch (error) {
      message.error('删除失败');
    }
  };

  if (error) {
    return <div>加载失败: {error.message}</div>;
  }

  const renderCourseCard = (course: any) => (
    <div key={course.id} className="bg-white rounded-lg overflow-hidden  mb-4">
      <div className="flex flex-col sm:flex-row">
        {/* 课程封面 */}
        <div className="w-full sm:w-48 h-32 sm:h-full relative">
          {course.coverUrl ? (
            <CosImage
              path={course.coverUrl}
              width={200}
              height={300}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              无封面
            </div>
          )}
        </div>

        {/* 课程信息 */}
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{course.summary}</p>
            </div>
            <Tag color={levelColors[course.level as keyof typeof levelColors]} className="self-start mt-2 sm:mt-0">
              {levelLabels[course.level as keyof typeof levelLabels]}
            </Tag>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
            <div>讲师：{course.instructor}</div>
            <div>分类：{course.category?.name}</div>
            <div>方向：{course.direction?.name}</div>
            <div>学生数：{course.studentCount}</div>
            <div>创建时间：{new Date(course.createdAt).toLocaleDateString()}</div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Link 
              href={`/courses/${course.id}`}
              className="text-primary hover:text-primary-dark"
              target="_blank"
            >
              查看课程
            </Link>
            <Button type="link" onClick={() => handleEditChapter(course)}>
              管理课程章节
            </Button>
            <Button type="link" onClick={() => handleEdit(course)}>
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个课程吗？"
              onConfirm={() => handleDelete(course.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl">课程管理</h1>
        <Button type="primary" icon={<Plus />} onClick={showModal}>
          添加课程
        </Button>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        /* 课程列表 */
        <div className="space-y-4">
          {courses.map(renderCourseCard)}
        </div>
      )}

      <AddCourseModal
        visible={isModalVisible}
        onClose={handleModalClose}
        editingCourse={editingCourse}
      />

      <ChapterModal
        open={isChapterModalOpen}
        onCancel={() => setIsChapterModalOpen(false)}
        courseId={selectedCourseId!}
      />
    </div>
  );
} 