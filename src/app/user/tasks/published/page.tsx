'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tag, Button, Space, Empty, Pagination, Modal, Input } from 'antd';
import Swal from 'sweetalert2';
import { 
  EyeOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  MessageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { request } from '@/utils/request';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;

interface Task {
  id: number;
  title: string;
  content: string;
  status: string;
  points: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  rejectReason?: string;
  category: {
    id: number;
    name: string;
  };
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
      avatar: string;
    };
    createdAt: string;
  }>;
  assignment?: {
    id: number;
    assignee: {
      id: number;
      nickname: string;
      avatar: string;
    };
    assignedAt: string;
    proof?: string;
    fileUrls?: any[];
  };
  likeCount: number;
  favoriteCount: number;
  applicationCount: number;
  completedAt?: string;
  noNeedMeConfirmed?: boolean;
}

const PublishedTasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [confirming, setConfirming] = useState(false);
  const isRequestingRef = useRef(false); // 防止重复请求

  useEffect(() => {
    fetchPublishedTasks();
  }, [currentPage, pageSize]);

  const fetchPublishedTasks = async () => {
    // 防止重复请求
    if (isRequestingRef.current) {
      return;
    }
    
    try {
      isRequestingRef.current = true;
      setLoading(true);
      const response = await request(`/user/tasks/published?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
      });
      
      if (response.code === 0 && response.data) {
        const data = response.data as { items: Task[]; total: number };
        setTasks(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('获取发布的任务失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取发布的任务失败',
        text: '请稍后重试',
      });
    } finally {
      setLoading(false);
      isRequestingRef.current = false;
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const getStatusTag = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
      'PENDING': { color: 'orange', text: '待审核' },
      'APPROVED': { color: 'blue', text: '已通过' },
      'REJECTED': { color: 'red', text: '已拒绝' },
      'IN_PROGRESS': { color: 'cyan', text: '执行中' },
      'COMPLETED': { color: 'green', text: '已完成' },
      'ADMIN_CONFIRMED': { color: 'purple', text: '管理员已确认完成' },
      'PUBLISHER_CONFIRMED': { color: 'green', text: '发布者已确认完成' },
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleDateString('zh-CN');
  };

  const handleConfirmCompletion = async () => {
    if (!currentTask) return;
    try {
      setConfirming(true);
      const response = await request(`/tasks/${currentTask.id}/confirm`, {
        method: 'POST',
      });
      if (response.code === 0) {
        Swal.fire({
          icon: 'success',
          title: '确认完成成功',
          text: '任务已完成确认',
        });
        setConfirmModalVisible(false);
        setCurrentTask(null);
        fetchPublishedTasks();
      } else {
        Swal.fire({
          icon: 'error',
          title: '确认失败',
          text: response.message || '确认失败，请重试',
        });
      }
    } catch (error) {
      console.error('确认完成失败:', error);
      Swal.fire({
        icon: 'error',
        title: '确认完成失败',
        text: '请稍后重试',
      });
    } finally {
      setConfirming(false);
    }
  };

  // 过滤HTML标签，只显示纯文本
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const canEditTask = (task: Task) => {
    return task.status === 'PENDING' || task.status === 'PUBLISHED' || task.status === 'REJECTED';
  };

  const canDeleteTask = (task: Task) => {
    return task.status === 'PENDING' || task.status === 'PUBLISHED' || task.status === 'REJECTED';
  };

  const getDeleteMessage = (task: Task) => {
    if (task.status === 'PENDING') {
      return '确定要删除这个待发布的任务吗？删除后无法恢复，但会返还积分。';
    } else if (task.status === 'REJECTED') {
      return '确定要删除这个被拒绝的任务吗？删除后会返还积分。';
    } else if (task.status === 'PUBLISHED') {
      return '确定要删除这个已发布的任务吗？如果已有申请者，删除可能会影响他们。';
    }
    return '确定要删除这个任务吗？';
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    
    try {
      setDeleting(true);
      const response = await request(`/tasks/${deletingTask.id}`, {
        method: 'DELETE',
      });
      
      if (response.code === 0) {
        Swal.fire({
          icon: 'success',
          title: '任务删除成功',
          text: '任务已成功删除',
        });
        setDeleteModalVisible(false);
        setDeletingTask(null);
        fetchPublishedTasks();
      } else {
        Swal.fire({
          icon: 'error',
          title: '删除失败',
          text: response.message || '删除失败，请重试',
        });
      }
    } catch (error) {
      console.error('删除任务失败:', error);
      Swal.fire({
        icon: 'error',
        title: '删除任务失败',
        text: '请稍后重试',
      });
    } finally {
      setDeleting(false);
    }
  };

  const renderTask = (task: Task) => (
    <Card 
      key={task.id} 
      className="mb-4"
      actions={[
        <Button 
          key="view" 
          type="text" 
          icon={<EyeOutlined />}
          onClick={() => window.open(`/tasks/${task.id}`, '_blank')}
        >
          查看详情
        </Button>,
        canEditTask(task) && (
          <Button 
            key="edit" 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => router.push(`/tasks/publish?edit=${task.id}`)}
          >
            编辑
          </Button>
        ),
        canDeleteTask(task) && (
          <Button 
            key="delete" 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeletingTask(task);
              setDeleteModalVisible(true);
            }}
          >
            删除
          </Button>
        ),
        // 如果状态是管理员已确认完成，并且noNeedMeConfirmed为false，则显示发布者确认完成按钮
        task.status === 'ADMIN_CONFIRMED' && !task.noNeedMeConfirmed && (
          <Button 
            key="confirm" 
            type="text" 
            icon={<CheckCircleOutlined />}
            onClick={async () => {
              try {
                const response = await request(`/tasks/${task.id}/proof`, {
                  method: 'GET',
                });
                if (response.code === 0) {
                  // 更新任务信息，包含完整的assignment数据
                  const updatedTask = {
                    ...task,
                    assignment: (response.data as any).assignment
                  };
                  setCurrentTask(updatedTask);
                  setConfirmModalVisible(true);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: '获取任务信息失败',
                    text: response.message || '请稍后重试',
                  });
                }
              } catch (error) {
                console.error('获取任务信息失败:', error);
                Swal.fire({
                  icon: 'error',
                  title: '获取任务信息失败',
                  text: '请稍后重试',
                });
              }
            }}
          >
            发布者确认完成
          </Button>
        )
      ].filter(Boolean)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{stripHtml(task.content)}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-xl font-bold text-orange-500 mb-1">{task.points} 积分</div>
          {getStatusTag(task.status)}
          {task.status === 'REJECTED' && task.rejectReason && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              <div className="font-medium">拒绝原因：</div>
              <div>{task.rejectReason}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <EyeOutlined className="mr-1" />
            {task.viewCount} 浏览
          </span>
          <span className="flex items-center">
            <MessageOutlined className="mr-1" />
            {task.applicationCount} 申请
          </span>
          <span className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            {formatTime(task.createdAt)}
          </span>
          {task.completedAt && (
            <span className="flex items-center text-orange-600">
              <ClockCircleOutlined className="mr-1" />
              截止: {formatTime(task.completedAt)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Tag color="blue">{task.category.name}</Tag>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      {tasks.length === 0 && !loading ? (
        <Empty 
          description="暂无发布的任务"
          className="my-8"
        >
          <Button 
            type="primary" 
            onClick={() => router.push('/tasks/publish')}
          >
            发布新任务
          </Button>
        </Empty>
      ) : (
        <>
          <div className="mb-4">
            {tasks.map(renderTask)}
          </div>
          
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={handleDeleteTask}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeletingTask(null);
        }}
        confirmLoading={deleting}
        okText="确定删除"
        cancelText="取消"
      >
        <p>{deletingTask ? getDeleteMessage(deletingTask) : ''}</p>
      </Modal>

      <Modal
        title="发布者确认完成"
        open={confirmModalVisible}
        onOk={handleConfirmCompletion}
        onCancel={() => {
          setConfirmModalVisible(false);
          setCurrentTask(null);
        }}
        confirmLoading={confirming}
        okText="确认完成"
        cancelText="取消"
      >
        {currentTask && currentTask.assignment && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">任务信息</h4>
              <p><strong>任务标题：</strong>{currentTask.title}</p>
              <p><strong>接单者：</strong>{currentTask.assignment.assignee.nickname}</p>
              <p><strong>接单时间：</strong>{formatTime(currentTask.assignment.assignedAt)}</p>
            </div>
            
            {currentTask.assignment.proof && (
              <div>
                <h4 className="font-medium mb-2">完成证明</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{currentTask.assignment.proof}</p>
              </div>
            )}
            
            {currentTask.assignment.fileUrls && currentTask.assignment.fileUrls.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">证明文件</h4>
                <div className="space-y-2">
                  {currentTask.assignment.fileUrls.map((file: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-blue-600">{file.name}</span>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        查看文件
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PublishedTasksPage; 