'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Tag, Space, Divider, Modal, Avatar, List, Input } from 'antd';
import Swal from 'sweetalert2';
import { 
  EyeOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  MessageOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  FileOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import qs from 'qs';
import { TaskCommentSection } from './components/TaskCommentSection';
import { getUserAuth } from '@/utils/client-auth';

const { TextArea } = Input;

interface TaskCategory {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

interface TaskApplication {
  id: number;
  applicant: {
    id: number;
    nickname: string;
    avatar: string;
  };
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  content: string;
  status: string;
  points: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category: TaskCategory;
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  applications: TaskApplication[];
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
  hasLiked: boolean;
  hasFavorited: boolean;
  completedAt?: string; // Added for task completion time
  attachments?: any[]; // 任务附件
}

const TaskDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [applyReason, setApplyReason] = useState('');
  const [applying, setApplying] = useState(false);
  const [liking, setLiking] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; nickname: string } | null>(null);

  // 获取任务详情
  const fetchTaskDetail = async () => {
    try {
      const response = await request(`/tasks/${taskId}`, {
        method: 'GET',
      });
      if (ResponseUtil.success(response)) {
        setTask(response.data as Task);
      }
    } catch (error) {
      console.error('获取任务详情失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取任务详情失败',
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

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail();
    }
    // 获取当前用户信息
    const { userInfo } = getUserAuth();
    if (userInfo) {
      setCurrentUser({
        id: userInfo.id,
        nickname: userInfo.username
      });
    }
  }, [taskId]);

  // 报名任务
  const handleApply = async () => {
    // 检查用户是否已登录
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    if (!applyReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请填写报名理由',
        text: '请详细说明您为什么适合这个任务',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    setApplying(true);
    try {
      const response = await request(`/tasks/${taskId}/apply`, {
        method: 'POST',
        body: qs.stringify({ reason: applyReason }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (ResponseUtil.success(response)) {
        // 接单成功后刷新用户信息，更新积分显示
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('refreshUserInfo'));
        }
        
        Swal.fire({
          icon: 'success',
          title: '报名成功',
          text: '您的报名信息已更新，等待审核',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
        setApplyModalVisible(false);
        setApplyReason('');
        // 重新获取任务详情
        fetchTaskDetail();
      }
    } catch (error) {
      console.error('报名失败:', error);
      Swal.fire({
        icon: 'error',
        title: '报名失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setApplying(false);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    if (!task) return;
    
    // 检查用户是否已登录
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setLiking(true);
    try {
      const response = await request(`/tasks/${taskId}/like`, {
        method: 'POST',
      });
      if (ResponseUtil.success(response)) {
        const { hasLiked, likeCount } = response.data as { hasLiked: boolean; likeCount: number };
        setTask(prev => prev ? {
          ...prev,
          hasLiked,
          likeCount,
        } : null);
      }
    } catch (error) {
      console.error('点赞失败:', error);
      Swal.fire({
        icon: 'error',
        title: '点赞失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setLiking(false);
    }
  };

  // 处理收藏
  const handleFavorite = async () => {
    if (!task) return;
    
    // 检查用户是否已登录
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setFavoriting(true);
    try {
      const response = await request(`/tasks/${taskId}/favorite`, {
        method: 'POST',
      });
      if (ResponseUtil.success(response)) {
        const { hasFavorited, favoriteCount } = response.data as { hasFavorited: boolean; favoriteCount: number };
        setTask(prev => prev ? {
          ...prev,
          hasFavorited,
          favoriteCount,
        } : null);
      }
    } catch (error) {
      console.error('收藏失败:', error);
      Swal.fire({
        icon: 'error',
        title: '收藏失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setFavoriting(false);
    }
  };

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap = {
      PENDING: { color: 'orange', text: '待审核' },
      APPROVED: { color: 'blue', text: '已通过' },
      REJECTED: { color: 'red', text: '已拒绝' },
      IN_PROGRESS: { color: 'green', text: '执行中' },
      COMPLETED: { color: 'purple', text: '已完成' },
      ADMIN_CONFIRMED: { color: 'cyan', text: '管理员已确认完成' },
      PUBLISHER_CONFIRMED: { color: 'green', text: '发布者已确认完成' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
    
    // 为"执行中"状态添加特殊样式
    if (status === 'IN_PROGRESS') {
      return (
        <Tag 
          color={config.color}
          className="text-lg font-bold px-4 py-2 border-2 border-green-500 shadow-lg animate-pulse"
        >
          {config.text}
        </Tag>
      );
    }
    
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 格式化时间
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">任务不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Button onClick={() => router.back()}>
            返回
          </Button>
        </div>

        {/* 任务详情卡片 */}
        <Card className="mb-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Tag color="blue">{task.category.name}</Tag>
                  {getStatusTag(task.status)}
                </div>
                <h1 className="text-2xl font-normal text-gray-900 mb-2">
                  {task.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UserOutlined className="mr-1" />
                    {task.author.nickname}
                  </div>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {formatTime(task.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <EyeOutlined className="mr-1" />
                    {task.viewCount} 次浏览
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium text-orange-500 mb-1">
                  {task.points} 积分
                </div>
                <div className="text-sm text-gray-500">悬赏金额</div>
              </div>
            </div>
          </div>

          <Divider />

          {/* 任务内容 */}
          <div className="mb-6">
            <h3 className="text-lg font-normal text-gray-900 mb-4">任务详情</h3>
            <div className="prose max-w-none">
              <div 
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: task.content }}
              />
            </div>
          </div>

          {/* 任务附件 */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-normal text-gray-900 mb-4 flex items-center">
                <FileOutlined className="text-blue-500 mr-2" />
                任务附件 ({task.attachments.length}个文件)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {task.attachments.map((attachment, index) => {
                  // 解析附件数据
                  let fileName = '';
                  let fileUrl = '';
                  
                  if (typeof attachment === 'string') {
                    fileUrl = attachment;
                    fileName = `附件${index + 1}`;
                  } else if (attachment && typeof attachment === 'object') {
                    fileName = attachment.name || `附件${index + 1}`;
                    fileUrl = attachment.url || attachment;
                  }
                  
                  // 获取文件扩展名
                  const fileExtension = fileName.split('.').pop()?.toLowerCase();
                  
                  // 判断文件类型
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
                  const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExtension || '');
                  const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileExtension || '');
                  
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        {/* 文件类型图标 */}
                        <div className="flex-shrink-0">
                          {isImage ? (
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <PictureOutlined className="text-green-600 text-xl" />
                            </div>
                          ) : isVideo ? (
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <PlayCircleOutlined className="text-purple-600 text-xl" />
                            </div>
                          ) : isDocument ? (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileTextOutlined className="text-blue-600 text-xl" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileOutlined className="text-gray-600 text-xl" />
                            </div>
                          )}
                        </div>
                        
                        {/* 文件信息 */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate mb-1" title={fileName}>
                            {fileName}
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {fileExtension ? `.${fileExtension.toUpperCase()}` : '未知格式'}
                          </div>
                          
                          {/* 操作按钮 */}
                          <div className="flex space-x-2">
                            <Button 
                              type="primary" 
                              size="small" 
                              icon={<DownloadOutlined />}
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = fileUrl;
                                link.download = fileName;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              下载
                            </Button>
                            
                            {isImage && (
                              <Button 
                                size="small" 
                                icon={<EyeOutlined />}
                                onClick={() => window.open(fileUrl, '_blank')}
                              >
                                预览
                              </Button>
                            )}
                            
                            {isVideo && (
                              <Button 
                                size="small" 
                                icon={<PlayCircleOutlined />}
                                onClick={() => window.open(fileUrl, '_blank')}
                              >
                                播放
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* 任务完成时间 */}
          {task.completedAt && (
            <div className="mb-6">
              <h3 className="text-lg font-normal text-gray-900 mb-4">截止时间要求</h3>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-l-orange-500">
                <div className="flex items-center">
                  <ClockCircleOutlined className="text-orange-500 mr-2" />
                  <span className="text-gray-700">
                    任务必须在 <strong>{formatTime(task.completedAt)}</strong> 前完成
                  </span>
                </div>
              </div>
            </div>
          )}



          {/* 操作按钮 */}
          <div className="flex gap-4">
            <Button 
              type="primary" 
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => setApplyModalVisible(true)}
              disabled={task.status !== 'APPROVED' || currentUser?.id === task.author.id}
            >
              {currentUser?.id === task.author.id 
                ? '不能报名自己的任务' 
                : task.status === 'IN_PROGRESS' 
                  ? '任务执行中' 
                  : '报名任务'
              }
            </Button>
           
            <Button 
              size="large"
              icon={task.hasLiked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              loading={liking}
              type={task.hasLiked ? 'primary' : 'default'}
              className={task.hasLiked ? 'bg-cyan-500 border-cyan-500 text-white hover:bg-cyan-600 hover:border-cyan-600' : ''}
            >
              {task.hasLiked ? '已点赞' : '点赞'} ({task.likeCount})
            </Button>
            <Button 
              size="large"
              icon={task.hasFavorited ? <StarFilled /> : <StarOutlined />}
              onClick={handleFavorite}
              loading={favoriting}
              type={task.hasFavorited ? 'primary' : 'default'}
              className={task.hasFavorited ? 'bg-cyan-500 border-cyan-500 text-white hover:bg-cyan-600 hover:border-cyan-600' : ''}
            >
              {task.hasFavorited ? '已收藏' : '收藏'} ({task.favoriteCount})
            </Button>
          </div>
        </Card>

        {/* 任务状态信息 */}
        {task.assignment && (
          <Card className="mb-6 border-l-4 border-l-green-500">
            <h3 className="text-lg font-normal text-gray-900 mb-4 flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              任务执行情况
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <UserOutlined className="text-blue-500 mr-2" />
                  <span className="text-gray-600 font-medium">执行者</span>
                </div>
                <div className="flex items-center">
                  <Avatar src={task.assignment.assignee.avatar} size="large" className="mr-3" />
                  <span className="text-lg font-medium text-gray-900">{task.assignment.assignee.nickname}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <ClockCircleOutlined className="text-orange-500 mr-2" />
                  <span className="text-gray-600 font-medium">分配时间</span>
                </div>
                <span className="text-lg text-gray-900">{formatTime(task.assignment.assignedAt)}</span>
              </div>
            </div>
            
            {task.assignment.proof && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <MessageOutlined className="text-blue-500 mr-2" />
                  <span className="text-gray-600 font-medium">完成证明</span>
                </div>
                <div className="whitespace-pre-wrap text-gray-700 bg-white p-3 rounded border">
                  {task.assignment.proof}
                </div>
              </div>
            )}

            {/* 完成证明文件 */}
            {task.assignment.fileUrls && task.assignment.fileUrls.length > 0 && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FileOutlined className="text-green-500 mr-2" />
                  <span className="text-gray-600 font-medium">完成证明文件 ({task.assignment.fileUrls.length}个)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {task.assignment.fileUrls.map((file, index) => {
                    // 解析文件数据
                    let fileName = '';
                    let fileUrl = '';
                    
                    if (typeof file === 'string') {
                      fileUrl = file;
                      fileName = `证明文件${index + 1}`;
                    } else if (file && typeof file === 'object') {
                      fileName = file.name || `证明文件${index + 1}`;
                      fileUrl = file.url || file;
                    }
                    
                    // 获取文件扩展名
                    const fileExtension = fileName.split('.').pop()?.toLowerCase();
                    
                    // 判断文件类型
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
                    const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExtension || '');
                    const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileExtension || '');
                    
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow border border-green-200">
                        <div className="flex items-start space-x-2">
                          {/* 文件类型图标 */}
                          <div className="flex-shrink-0">
                            {isImage ? (
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <PictureOutlined className="text-green-600 text-lg" />
                              </div>
                            ) : isVideo ? (
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <PlayCircleOutlined className="text-purple-600 text-lg" />
                              </div>
                            ) : isDocument ? (
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileTextOutlined className="text-blue-600 text-lg" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileOutlined className="text-gray-600 text-lg" />
                              </div>
                            )}
                          </div>
                          
                          {/* 文件信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate mb-1" title={fileName}>
                              {fileName}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {fileExtension ? `.${fileExtension.toUpperCase()}` : '未知格式'}
                            </div>
                            
                            {/* 操作按钮 */}
                            <div className="flex space-x-1">
                              <Button 
                                type="primary" 
                                size="small" 
                                icon={<DownloadOutlined />}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = fileUrl;
                                  link.download = fileName;
                                  link.target = '_blank';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                下载
                              </Button>
                              
                              {isImage && (
                                <Button 
                                  size="small" 
                                  icon={<EyeOutlined />}
                                  onClick={() => window.open(fileUrl, '_blank')}
                                >
                                  预览
                                </Button>
                              )}
                              
                              {isVideo && (
                                <Button 
                                  size="small" 
                                  icon={<PlayCircleOutlined />}
                                  onClick={() => window.open(fileUrl, '_blank')}
                                >
                                  播放
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* 报名列表 */}
        {task.applications.length > 0 && (
          <Card>
            <h3 className="text-lg font-normal text-gray-900 mb-4">
              报名列表 ({task.applications.length}人)
            </h3>
            <List
              dataSource={task.applications}
              renderItem={(application) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={application.applicant.avatar} />}
                    title={application.applicant.nickname}
                    description={`报名时间：${formatTime(application.createdAt)}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* 评论区域 */}
        <TaskCommentSection taskId={parseInt(taskId)} />
      </div>

      {/* 报名弹窗 */}
      <Modal
        title="报名任务"
        open={applyModalVisible}
        onOk={handleApply}
        onCancel={() => setApplyModalVisible(false)}
        confirmLoading={applying}
        okText="确认报名"
        cancelText="取消"
      >
        <div className="mb-4">
          <p className="text-gray-600 mb-2">请填写报名理由，说明您为什么适合这个任务：</p>
          <TextArea
            rows={6}
            placeholder="请详细描述您的相关经验、技能和完成任务的计划..."
            value={applyReason}
            onChange={(e) => setApplyReason(e.target.value)}
          />
        </div>
        <div className="bg-blue-50 p-3 rounded">
          <div className="flex items-start">
            <ExclamationCircleOutlined className="text-blue-500 mr-2 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">报名须知：</p>
              <ul className="text-xs space-y-1">
                <li>• 请确保您有足够的能力和时间完成此任务</li>
                <li>• 报名后管理员会审核您的申请</li>
                <li>• 被选中后请及时开始执行任务</li>
                <li>• 完成任务后可获得相应积分奖励</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetailPage; 