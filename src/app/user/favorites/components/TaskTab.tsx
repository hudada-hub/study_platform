'use client';

import { useState, useEffect } from 'react';
import { Empty, Card, Tag, Button, Pagination, Space } from 'antd';
import Swal from 'sweetalert2';
import { 
  EyeOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  content: string;
  status: string;
  points: number;
  viewCount: number;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  likeCount: number;
  favoriteCount: number;
  applicationCount: number;
  hasLiked: boolean;
  hasFavorited: boolean;
  favoritedAt: string;
}

const TaskTab = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchFavorites = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await request(`/user/favorites/tasks?${queryParams.toString()}`, {
        method: 'GET',
      });

      if (ResponseUtil.success(response)) {
        const data = response.data as { items: Task[]; total: number };
        setTasks(data.items || []);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error('获取收藏任务失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取收藏任务失败',
        text: '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'orange', text: '待审核' },
      APPROVED: { color: 'blue', text: '已通过' },
      REJECTED: { color: 'red', text: '已拒绝' },
      IN_PROGRESS: { color: 'green', text: '执行中' },
      COMPLETED: { color: 'purple', text: '已完成' },
      ADMIN_CONFIRMED: { color: 'cyan', text: '管理员已确认完成' },
      PUBLISHER_CONFIRMED: { color: 'green', text: '发布者已确认完成' },
    };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatTime = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleString('zh-CN');
    } catch {
      return time;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
  return (
    <Empty
      description="暂无收藏的任务单"
      className="py-8"
    />
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Tag color="blue">{task.category?.name || '未分类'}</Tag>
                {getStatusTag(task.status)}
              </div>
              <h3 className="text-lg font-normal text-gray-900 mb-2 cursor-pointer hover:text-cyan-600"
                  onClick={() => router.push(`/tasks/${task.id}`)}>
                {task.title}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {task.content.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <UserOutlined className="mr-1" />
                  {task.author?.nickname || '未知用户'}
                </div>
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  {formatTime(task.createdAt)}
                </div>
                <div className="flex items-center">
                  <EyeOutlined className="mr-1" />
                  {task.viewCount || 0} 次浏览
                </div>
                <div className="flex items-center">
                  <MessageOutlined className="mr-1" />
                  {task.applicationCount || 0} 人报名
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>收藏时间: {formatTime(task.favoritedAt)}</span>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-xl font-medium text-orange-500 mb-1">
                {task.points || 0} 积分
              </div>
              <div className="text-sm text-gray-500">悬赏金额</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Space>
                <Button 
                  size="small"
                  icon={task.hasLiked ? <HeartFilled /> : <HeartOutlined />}
                  className={task.hasLiked ? 'text-red-500' : ''}
                >
                  {task.likeCount || 0}
                </Button>
                <Button 
                  size="small"
                  icon={<StarFilled />}
                  className="text-yellow-500"
                >
                  {task.favoriteCount || 0}
                </Button>
              </Space>
              <Button 
                type="primary" 
                size="small"
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                查看详情
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {/* 分页 */}
      {total > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条收藏`
            }
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}
    </div>
  );
};

export default TaskTab; 