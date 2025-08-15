'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, Card } from 'antd';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import ForumPostCard from '../forum/ForumPostCard';
import Link from 'next/link';

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  section: {
    id: number;
    name: string;
  };
  isTop: boolean;
  isEssence: boolean;
  isHot: boolean;
  
}

const ForumSection: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<ForumPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLatestPosts = async () => {
    try {
      const response = await request('/forum/posts?page=1&pageSize=8&sort=createdAt');
      if (ResponseUtil.success(response)) {
        setLatestPosts((response.data as any).items || []);
      }
    } catch (error) {
      console.error('获取最新帖子失败:', error);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const response = await request('/forum/posts?page=1&pageSize=8&sort=viewCount');
      if (ResponseUtil.success(response)) {
        setPopularPosts((response.data as any).items || []);
      }
    } catch (error) {
      console.error('获取热门帖子失败:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchLatestPosts(), fetchPopularPosts()]).finally(() => {
      setLoading(false);
    });
  }, []);



  const renderPostCard = (post: ForumPost) => (
    <ForumPostCard key={post.id} post={post} />
  );

  const renderPostList = (posts: ForumPost[]) => (
    <div className="space-y-0">
      {posts.map(renderPostCard)}
    </div>
  );

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-normal text-gray-900">论坛动态</h2>
        <Link 
          href="/forum" 
          className="text-cyan-500 hover:text-cyan-600 transition-colors"
        >
          查看更多 →
        </Link>
      </div>
      
      <Tabs 
        defaultActiveKey="latest" 
        className="forum-tabs"
        items={[
          {
            key: 'latest',
            label: '最新帖子',
            children: (
              <div>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-3">
                            <div className="flex gap-2">
                              <div className="h-5 bg-gray-200 rounded w-16"></div>
                              <div className="h-5 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="flex justify-between">
                              <div className="flex gap-4">
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                              </div>
                              <div className="flex gap-4">
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderPostList(latestPosts)
                )}
              </div>
            ),
          },
          {
            key: 'popular',
            label: '热门帖子',
            children: (
              <div>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-3">
                            <div className="flex gap-2">
                              <div className="h-5 bg-gray-200 rounded w-16"></div>
                              <div className="h-5 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="flex justify-between">
                              <div className="flex gap-4">
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                              </div>
                              <div className="flex gap-4">
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                                <div className="h-3 bg-gray-200 rounded w-12"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  renderPostList(popularPosts)
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ForumSection; 