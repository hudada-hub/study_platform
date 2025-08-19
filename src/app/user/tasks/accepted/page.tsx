'use client';

import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Space, Empty, Pagination, Modal, Input, Upload, message } from 'antd';
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
  PauseCircleOutlined,
  UploadOutlined
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
  completedAt?: string;
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
  assignment: {
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
}

const AcceptedTasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [proof, setProof] = useState('');
  const [submittingProof, setSubmittingProof] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchAcceptedTasks();
  }, [currentPage, pageSize]);

  const fetchAcceptedTasks = async () => {
    try {
      setLoading(true);
      const response = await request(`/user/tasks/accepted?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
      });
      
      if (response.code === 0 && response.data) {
        const data = response.data as { items: Task[]; total: number };
        setTasks(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('获取接受的任务失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取接受的任务失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  };

  const getStatusTag = (status: string) => {
    const statusMap: { [key: string]: { color: string; text: string } } = {
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

  const canSubmitProof = (task: Task) => {
    return task.status === 'IN_PROGRESS' && !task.assignment.proof;
  };

  const handleSubmitProof = async () => {
    if (!currentTask || !proof.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入完成证明',
        text: '请详细描述您如何完成这个任务',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }
    
    try {
      setSubmittingProof(true);
      // 处理文件列表，提取name和url
      const fileUrls = fileList.map(file => ({
        name: file.name,
        url: file.response?.url || file.url
      }));

      const response = await request(`/user/tasks/accepted/${currentTask.id}/proof`, {
        method: 'POST',
        body: JSON.stringify({ 
          proof,
          fileUrls: fileUrls
        }),
      });
      
      if (response.code === 0) {
        Swal.fire({
          icon: 'success',
          title: '完成证明提交成功',
          text: '您的完成证明已提交，等待审核',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
        setProofModalVisible(false);
        setCurrentTask(null);
        setProof('');
        setFileList([]);
        fetchAcceptedTasks();
      } else {
        Swal.fire({
          icon: 'error',
          title: '提交失败',
          text: response.message || '提交失败，请重试',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('提交完成证明失败:', error);
      Swal.fire({
        icon: 'error',
        title: '提交完成证明失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setSubmittingProof(false);
    }
  };

  // 过滤HTML标签，只显示纯文本
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
        canSubmitProof(task) && (
          <Button 
            key="proof" 
            type="text" 
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setCurrentTask(task);
              setProofModalVisible(true);
            }}
          >
            提交完成证明
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
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <EyeOutlined className="mr-1" />
            {task.viewCount} 浏览
          </span>
          <span className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            接受时间: {formatTime(task.assignment.assignedAt)}
          </span>
          {task.completedAt && (
            <span className="flex items-center text-orange-600">
              <ClockCircleOutlined className="mr-1" />
              截止: {formatTime(task.completedAt)}
            </span>
          )}
          {task.assignment.proof && (
            <span className="flex items-center text-green-600">
              <CheckCircleOutlined className="mr-1" />
              已提交证明
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Tag color="blue">{task.category.name}</Tag>
          <Tag color="purple">发布者: {task.author.nickname}</Tag>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      {tasks.length === 0 && !loading ? (
        <Empty 
          description="暂无接受的任务"
          className="my-8"
        >
          <Button 
            type="primary" 
            onClick={() => router.push('/tasks')}
          >
            浏览任务
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
        title="提交完成证明"
        open={proofModalVisible}
        onOk={handleSubmitProof}
        onCancel={() => {
          setProofModalVisible(false);
          setCurrentTask(null);
          setProof('');
          setFileList([]);
        }}
        confirmLoading={submittingProof}
        okText="提交证明"
        cancelText="取消"
      >
        <div className="mb-4">
          <p className="text-gray-600 mb-2">请详细描述您完成任务的证明：</p>
          <TextArea
            rows={6}
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="请详细描述您如何完成这个任务，包括具体的步骤、结果等..."
          />
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">上传证明文件（可选，最多5个文件）：</p>
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await request('/common/upload?strictFormat=false', {
                  method: 'POST',
                  body: formData,
                });
                
                if (response.code === 0) {
                  onSuccess?.(response.data);
                } else {
                  onError?.(new Error(response.message || '上传失败'));
                }
                              } catch (error) {
                  onError?.(error as any);
                }
            }}
            maxCount={5}
            multiple
            accept="*/*"
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
          <p className="text-xs text-gray-500 mt-1">支持任意格式文件，单个文件不超过10MB</p>
        </div>
      </Modal>
    </div>
  );
};

export default AcceptedTasksPage; 