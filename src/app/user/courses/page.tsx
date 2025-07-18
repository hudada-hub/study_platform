'use client';
import { useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Image, Tag } from 'antd';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AddCourseModal from './components/AddCourseModal';
import { useCourses } from './hooks/useCourses';
import { request } from '@/utils/request';
import ChapterModal from './components/ChapterModal';
import { CosImage } from '@/components/common/CosImage';

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

  const showModal = () => {
    setEditingCourse(null);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingCourse(null);
    refreshCourses();
  };

  // 处理章节管理
  const handleEditChapter = (record: any) => {
    setSelectedCourseId(record.id);
    setIsChapterModalOpen(true);
  };

  // 表格列配置
  const columns = [
    {
      title: '封面',
      dataIndex: 'coverUrl',
      key: 'coverUrl',
      width: 120,
      render: (coverUrl: string) => (
        <div className="w-20 h-12 overflow-hidden rounded">
          {coverUrl ? (
            <CosImage
              path={coverUrl}
              width={200}
              height={300}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              无封面
            </div>
          )}
        </div>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <div className="text-gray-400 text-sm mt-1">
            {record.summary}
          </div>
        </div>
      ),
    },
    {
      title: '讲师',
      dataIndex: 'instructor',
      key: 'instructor',
      width: 100,
    },
    {
      title: '分类/方向',
      key: 'category',
      width: 100,
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <div>分类：{record.category?.name}</div>
          <div>方向：{record.direction?.name}</div>
        </Space>
      ),
    },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      width: 50,
      render: (level: string) => (
        <Tag color={levelColors[level as keyof typeof levelColors]}>
          {levelLabels[level as keyof typeof levelLabels]}
        </Tag>
      ),
    },
    {
      title: '学生数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link target='_blank' href={`/courses/${record.id}`} type="link" >
            查看课程
          </Link>
          <Button type="link" onClick={() => handleEditChapter(record)}>
            管理课程章节
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个课程吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl">课程管理</h1>
        <Button type="primary" icon={<Plus />} onClick={showModal}>
          添加课程
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={courses}
        loading={loading}
        rowKey="id"
      />

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