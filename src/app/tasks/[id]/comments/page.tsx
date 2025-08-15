'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TaskCommentSection } from '../components/TaskCommentSection';

const TaskCommentsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            返回任务详情
          </Button>
        </div>

        {/* 评论区域 */}
        <TaskCommentSection taskId={parseInt(taskId)} />
      </div>
    </div>
  );
};

export default TaskCommentsPage; 