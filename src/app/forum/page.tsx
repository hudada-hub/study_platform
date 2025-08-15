'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ForumPost } from '@/types/forum';
import ForumMenu from '@/components/forum/ForumMenu';
import { ForumCarousel } from '@/components/forum/ForumCarousel';
import ForumPostList from '@/components/forum/ForumPostList';
import ForumSidebarPanel from '@/components/forum/ForumSidebarPanel';
import ForumHotSections from '@/components/forum/ForumHotSections';
import { ClientUser, getCurrentUser } from '@/utils/client-auth';


export default function ForumPage() {
  const [latestPosts, setLatestPosts] = useState<ForumPost[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    fetchLatestPosts();
    // 获取当前用户信息
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      // 获取最新的10个帖子
      const response = await request('/forum/posts?page=1&pageSize=10', {
        method: 'GET',
      });
      
      if (response.code === 0 && response.data) {
        const data = response.data as { items: ForumPost[]; total: number; page: number; pageSize: number; totalPages: number };
        const posts = data.items || [];
        
        // 将前5个作为最新帖子，后5个作为推荐帖子
        if (posts.length > 5) {
          setLatestPosts(posts.slice(0, 5));
          setRecommendedPosts(posts.slice(5, 10));
        } else {
          setLatestPosts(posts);
          setRecommendedPosts([]);
        }
      }
    } catch (error) {
      console.error('获取最新帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMyPosts = () => {
    // 处理我的帖子点击
    console.log('点击我的帖子');
  };

  const handleMyReplies = () => {
    // 处理我的回复点击
    console.log('点击我的回复');
  };

  // 处理帖子更新
  const handlePostUpdate = (updatedPost: ForumPost) => {
    // 更新本地状态
    setLatestPosts(prev => 
      prev.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
    setRecommendedPosts(prev => 
      prev.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <ForumMenu />
          <div className="p-6">
            {/* 主要内容区域 - 两栏布局 */}
            <div className="flex gap-6">
              {/* 左侧内容：轮播图和文章列表 */}
              <div className="flex-1 space-y-6">
                {/* 论坛轮播图 */}
                <ForumCarousel />
                
                {/* 文章列表 */}
                <ForumPostList
                  latestPosts={latestPosts}
                  recommendedPosts={recommendedPosts}
                  loading={loading}
                  currentUser={currentUser}
                  onPostUpdate={handlePostUpdate}
                />
              </div>
              
              {/* 右侧信息面板 */}
              <div className="w-80 space-y-6">
                <ForumSidebarPanel />
                
                {/* 热门版块 */}
                <ForumHotSections />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 