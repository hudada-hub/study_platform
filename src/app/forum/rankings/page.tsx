'use client';

import React, { useState, useEffect } from 'react';
import ForumMenu from '@/components/forum/ForumMenu';
import ForumRankings from '@/components/forum/ForumRankings';
import { request } from '@/utils/request';

// 排行榜帖子数据类型
interface RankingPost {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  coverUrl: string;
  likeCount: number;
  section: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  author: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

export default function ForumRankingsPage() {
  const [rankings, setRankings] = useState<RankingPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取阅读量最高的帖子
  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const response = await request('/forum/rankings', {
          method: 'GET',
        });
        
        if (response.code === 0 && response.data) {
          // 直接使用API返回的数据，最多20个
          const topPosts = (response.data as RankingPost[]) || [];
          setRankings(topPosts.slice(0, 20));
        }
      } catch (error) {
        console.error('获取排行榜数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <ForumMenu />
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <ForumRankings rankings={rankings} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 