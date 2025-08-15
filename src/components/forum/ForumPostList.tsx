'use client';

import React, { useState } from 'react';
import ForumTabs from './ForumTabs';
import ForumPostItem from './ForumPostItem';
import { ForumPost as RealForumPost } from '@/types/forum';

interface ForumPostListProps {
  latestPosts: RealForumPost[];
  recommendedPosts: RealForumPost[];
  loading?: boolean;
  currentUser?: any; // 当前用户信息
  onPostUpdate?: (updatedPost: RealForumPost) => void; // 帖子更新回调
}

/**
 * 论坛文章列表组件
 */
const ForumPostList: React.FC<ForumPostListProps> = ({
  latestPosts,
  recommendedPosts,
  loading = false,
  currentUser,
  onPostUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'recommended'>('latest');

  const currentPosts = activeTab === 'latest' ? latestPosts : recommendedPosts;

  // 转换数据格式以适配ForumPostItem组件
  const transformPost = (post: RealForumPost) => ({
    id: post.id.toString(),
    title: post.title,
    description: post.content ? post.content.replace(/<[^>]*>/g, ''): '',
    author: post.author?.nickname || '匿名用户',
    link: `/forum/posts/${post.id}`,
    imageUrl: post.imageUrl,
  });

  const transformedPosts = currentPosts.map(transformPost);

  return (
    <div className="bg-white rounded-lg">
      {/* 标签页 */}
      <ForumTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 文章列表 */}
      <div className="px-6 pb-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            加载中...
          </div>
        ) : (
          <div className="space-y-4">
            {currentPosts.map((post) => (
              <ForumPostItem
                key={post.id}
                id={post.id.toString()}
                title={post.title}
                description={post.content ? post.content.replace(/<[^>]*>/g, '') : ''}
                imageUrl={post.imageUrl}
                author={post.author?.nickname || '匿名用户'}
                link={`/forum/posts/${post.id}`}
                post={post} // 传递完整的帖子数据
                currentUser={currentUser} // 传递当前用户
                onPostUpdate={onPostUpdate} // 传递更新回调
              />
            ))}
          </div>
        )}
        
        {/* 空状态 */}
        {!loading && transformedPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无{activeTab === 'latest' ? '最新' : '推荐'}文章
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPostList; 