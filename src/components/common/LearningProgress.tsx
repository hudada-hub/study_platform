'use client';

import React, { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import { FiClock, FiPlay, FiPause, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

interface LearningStats {
  totalEvents: number;
  eventTypeStats: Array<{
    eventType: string;
    _count: { eventType: number };
  }>;
  totalPlayTimeMinutes: number;
}

interface LearningProgressProps {
  courseId: number;
  chapterId?: number;
  className?: string;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({
  courseId,
  chapterId,
  className = ''
}) => {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams({
          courseId: courseId.toString(),
        });
        
        if (chapterId) {
          params.append('chapterId', chapterId.toString());
        }

        const response = await request<LearningStats>(`/analytics/learning-events?${params}`);
        
        if (response.code === 0 && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('获取学习统计失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [courseId, chapterId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const getEventTypeCount = (eventType: string) => {
    const stat = stats.eventTypeStats.find(s => s.eventType === eventType);
    return stat ? stat._count.eventType : 0;
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
        <FiTrendingUp className="text-orange-500" />
        学习统计
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">
            {stats.totalPlayTimeMinutes}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <FiClock className="w-4 h-4" />
            学习时长(分钟)
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {getEventTypeCount('video_play')}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <FiPlay className="w-4 h-4" />
            播放次数
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {getEventTypeCount('video_end')}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <FiCheckCircle className="w-4 h-4" />
            完成次数
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            {getEventTypeCount('progress_update')}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <FiPause className="w-4 h-4" />
            进度更新
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          总事件数: {stats.totalEvents}
        </div>
      </div>
    </div>
  );
}; 