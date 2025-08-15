'use client';

import React, { useState, useEffect } from 'react';
import { FiEye, FiMessageSquare, FiStar, FiClock, FiUser } from 'react-icons/fi';
import { ForumPost } from '@/types/forum';
import { Pagination, Tag } from 'antd';
import Link from 'next/link';
import PostManageMenu from './PostManageMenu';
import { User } from '@prisma/client';
import { canManagePost, ClientUser, getCurrentUser } from '@/utils/client-auth';
import { request } from '@/utils/request';

interface ForumPostsListProps {
  posts: ForumPost[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange?: (sortType: string) => void; // 新增排序回调
  sectionId: string;
  currentUser?: ClientUser | null;
}

const ForumPostsList: React.FC<ForumPostsListProps> = ({
  posts,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  sectionId,
  currentUser,
}) => {
  // 获取当前用户信息
  const [currentUserState, setCurrentUserState] = useState<ClientUser | null>(null);
  // 排序状态
  const [currentSort, setCurrentSort] = useState('latest'); // latest, hot, popular, essence

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    console.log('ForumPostsList - 当前用户:', user); // 调试信息
  }, []);

  // 使用状态中的用户信息，如果没有则使用传入的currentUser
  const effectiveUser = currentUserState || currentUser || null;
  


  // 处理排序变化
  const handleSortChange = (sortType: string) => {
    setCurrentSort(sortType);
    if (onSortChange) {
      onSortChange(sortType);
    }
  };

  // 处理快速切换帖子属性
  const handleQuickToggle = async (postId: number, property: 'isTop' | 'isEssence' | 'isHot', value: boolean) => {
    try {
      const response = await request(`/forum/posts/${postId}/manage`, {
        method: 'PUT',
        body: JSON.stringify({ [property]: value })
      });

      if (response.code === 0) {
        // 更新本地状态
        const updatedPosts = posts.map(post => 
          post.id === postId ? { ...post, [property]: value } : post
        );
        // 这里需要通知父组件更新数据
        window.location.reload(); // 临时使用页面刷新
      } else {
        console.error('操作失败:', response.message);
      }
    } catch (error) {
      console.error('操作失败:', error);
    }
  };
  // 处理帖子更新
  const handlePostUpdate = (updatedPost: ForumPost) => {
    // 这里可以更新本地状态，或者触发父组件重新获取数据
    // 暂时使用页面刷新
    window.location.reload();
  };

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      case 'DRAFT':
        return 'default';
      default:
        return 'default';
    }
  };

  // 获取状态标签文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return '已发布';
      case 'PENDING':
        return '待审核';
      case 'REJECTED':
        return '已拒绝';
      case 'DRAFT':
        return '草稿';
      default:
        return '未知';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-start">
        {/* 排序标签 */}
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <span 
            className={`cursor-pointer transition-colors ${
              currentSort === 'latest' 
                ? 'text-cyan-500 font-medium' 
                : 'hover:text-cyan-500'
            }`}
            onClick={() => handleSortChange('latest')}
          >
            最新
          </span>
          <span 
            className={`cursor-pointer transition-colors ${
              currentSort === 'hot' 
                ? 'text-cyan-500 font-medium' 
                : 'hover:text-cyan-500'
            }`}
            onClick={() => handleSortChange('hot')}
          >
            热门
          </span>
          <span 
            className={`cursor-pointer transition-colors ${
              currentSort === 'popular' 
                ? 'text-cyan-500 font-medium' 
                : 'hover:text-cyan-500'
            }`}
            onClick={() => handleSortChange('popular')}
          >
            热帖
          </span>
          <span 
            className={`cursor-pointer transition-colors ${
              currentSort === 'essence' 
                ? 'text-cyan-500 font-medium' 
                : 'hover:text-cyan-500'
            }`}
            onClick={() => handleSortChange('essence')}
          >
            精华
          </span>
          <div className="w-px h-4 bg-gray-300"></div>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">暂无帖子</div>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors duration-200">
              <div className="flex items-center space-x-4 p-4">
                {/* 用户头像 */}
                <div className="flex-shrink-0">
                  {post.author?.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.nickname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* 帖子信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {/* 板块分类标签 */}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      [{post.section?.name}]
                    </span>
                    
                    {/* 特殊属性标签 */}
                    {post.isTop && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">置顶</span>
                    )}
                    {post.isEssence && (
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">精华</span>
                    )}
                    {post.isHot && (
                      <span className="text-xs bg-orange-500 text-white px-1 rounded">热门</span>
                    )}
                    
                    {/* 状态标签 - 只有有权限的用户才能看到 */}
                    {canManagePost(effectiveUser, post.section?.moderatorId) && (
                      <Tag color={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                      </Tag>
                    )}
                  </div>
                  
               
                  
                  <Link 
                    href={`/forum/posts/${post.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 block mb-2"
                  >
                    {post.title}
                  </Link>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <FiUser className="w-4 h-4" />
                      <span>{post.author?.nickname || '匿名用户'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    </span>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-4 h-4" />
                      <span>{post.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4" />
                      <span>{post.likeCount}</span>
                    </div>
                  </div>
                  
                  {/* 管理菜单 */}
                  <div className="flex justify-end">
                    {/* 调试信息 */}
                  
                    <PostManageMenu
                      post={post}
                      currentUser={effectiveUser}
                      onPostUpdate={handlePostUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            pageSize={10}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
          />
        </div>
      )}


    </div>
  );
};

export default ForumPostsList; 