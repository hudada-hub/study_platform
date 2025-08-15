'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { request } from '@/utils/request';

interface ForumSidebarPanelProps {
  postCount?: number; // 帖子总数
  memberCount?: number; // 本月登录会员总数
  onMyPosts?: () => void; // 我的帖子点击事件
  onMyReplies?: () => void; // 我的回复点击事件
}

/**
 * 论坛右侧信息面板
 */
const ForumSidebarPanel: React.FC<ForumSidebarPanelProps> = ({
  postCount: propPostCount,
  memberCount: propMemberCount,
  onMyPosts,
  onMyReplies,
}) => {
  const router = useRouter();
  const [postCount, setPostCount] = useState(propPostCount || 0);
  const [memberCount, setMemberCount] = useState(propMemberCount || 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propPostCount || !propMemberCount) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [propPostCount, propMemberCount]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await request('/forum/stats', {
        method: 'GET',
      });
      
      if (response.code === 0 && response.data) {
        const data = response.data as { postCount: number; memberCount: number };
        setPostCount(data.postCount || 0);
        setMemberCount(data.memberCount || 0);
      }
    } catch (error) {
      console.error('获取论坛统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMyPosts = () => {
    if (onMyPosts) {
      onMyPosts();
    } else {
      router.push('/user/forum/posts');
    }
  };

  const handleMyReplies = () => {
    if (onMyReplies) {
      onMyReplies();
    } else {
      router.push('/user/forum/replies');
    }
  };

  return (
    <aside className="w-full bg-white rounded-lg px-6 py-4 text-gray-700 select-none border border-gray-100">
      {/* 每日签到提示 */}
     
      {/* 统计数据 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">
            {loading ? '...' : postCount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">帖子总数</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">
            {loading ? '...' : memberCount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">本月登录会员总数</div>
        </div>
      </div>
      <hr className="my-2 border-gray-100" />
      {/* 帖子动态 */}
      <div className="text-center my-4">
        <div className="text-base mb-1">帖子动态</div>
        <div className="text-xs text-gray-400">社区帖子动态</div>
      </div>
      {/* 按钮区 */}
      <div className="flex justify-center gap-4 mt-2">
        <Button 
          size="small" 
          type="default" 
          className="rounded px-4" 
          onClick={handleMyPosts}
          loading={loading}
        >
          我的帖子
        </Button>
        <Button 
          size="small" 
          type="default" 
          className="rounded px-4" 
          onClick={handleMyReplies}
          loading={loading}
        >
          我的回复
        </Button>
      </div>
    </aside>
  );
};

export default ForumSidebarPanel; 