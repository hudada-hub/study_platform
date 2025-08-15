'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Form, Space, Divider } from 'antd';
import Swal from 'sweetalert2';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled } from '@ant-design/icons';

// 定义任务类型接口
interface Task {
  id: number;
  title: string;
  content: string;
  points: number;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  hasLiked: boolean;
  hasFavorited: boolean;
  author?: {
    nickname: string;
  };
}

const TestLikeFavoritePage: React.FC = () => {
  const [taskId, setTaskId] = useState(1);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [liking, setLiking] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  const fetchTaskDetail = async () => {
    setLoading(true);
    try {
      const response = await request(`/tasks/${taskId}`, {
        method: 'GET',
      });

      if (ResponseUtil.success(response)) {
        setTask(response.data as Task);
        console.log('Task:', response.data);
      }
    } catch (error) {
      console.error('获取任务失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取任务失败',
        text: '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!task) return;
    
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
        Swal.fire({
          icon: 'success',
          title: hasLiked ? '点赞成功' : '取消点赞成功',
          text: hasLiked ? '已成功点赞该任务' : '已取消点赞该任务',
        });
      }
    } catch (error) {
      console.error('点赞失败:', error);
      Swal.fire({
        icon: 'error',
        title: '点赞失败',
        text: '请稍后重试',
      });
    } finally {
      setLiking(false);
    }
  };

  const handleFavorite = async () => {
    if (!task) return;
    
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
        Swal.fire({
          icon: 'success',
          title: hasFavorited ? '收藏成功' : '取消收藏成功',
          text: hasFavorited ? '已成功收藏该任务' : '已取消收藏该任务',
        });
      }
    } catch (error) {
      console.error('收藏失败:', error);
      Swal.fire({
        icon: 'error',
        title: '收藏失败',
        text: '请稍后重试',
      });
    } finally {
      setFavoriting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card title="任务点赞收藏测试" className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务ID:
            </label>
            <Input
              type="number"
              value={taskId}
              onChange={(e) => setTaskId(parseInt(e.target.value) || 1)}
              placeholder="输入任务ID"
            />
          </div>

          <Space>
            <Button 
              type="primary" 
              onClick={fetchTaskDetail}
              loading={loading}
            >
              获取任务详情
            </Button>
          </Space>
        </Card>

        {/* 任务详情 */}
        {task && (
          <Card title="任务详情">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">{task.title}</h3>
              <p className="text-gray-600 mb-4">{task.content.replace(/<[^>]*>/g, '')}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>作者: {task.author?.nickname}</span>
                <span>积分: {task.points}</span>
                <span>浏览: {task.viewCount}</span>
              </div>

              <Divider />

              {/* 点赞收藏按钮 */}
              <div className="flex gap-4">
                <Button 
                  size="large"
                  icon={task.hasLiked ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleLike}
                  loading={liking}
                  className={task.hasLiked ? 'text-red-500' : ''}
                >
                  {task.hasLiked ? '已点赞' : '点赞'} ({task.likeCount || 0})
                </Button>
                <Button 
                  size="large"
                  icon={task.hasFavorited ? <StarFilled /> : <StarOutlined />}
                  onClick={handleFavorite}
                  loading={favoriting}
                  className={task.hasFavorited ? 'text-yellow-500' : ''}
                >
                  {task.hasFavorited ? '已收藏' : '收藏'} ({task.favoriteCount || 0})
                </Button>
              </div>

              {/* 状态信息 */}
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">当前状态:</h4>
                <div className="text-sm space-y-1">
                  <div>点赞状态: {task.hasLiked ? '已点赞' : '未点赞'}</div>
                  <div>点赞数: {task.likeCount || 0}</div>
                  <div>收藏状态: {task.hasFavorited ? '已收藏' : '未收藏'}</div>
                  <div>收藏数: {task.favoriteCount || 0}</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestLikeFavoritePage; 