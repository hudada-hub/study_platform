'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ForumPostItemProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  link?: string;
  // 添加管理相关的属性
  post?: any; // 完整的帖子数据
  currentUser?: any; // 当前用户
  onPostUpdate?: (updatedPost: any) => void; // 帖子更新回调
}

/**
 * 论坛文章列表项组件
 */
const ForumPostItem: React.FC<ForumPostItemProps> = ({
  id,
  title,
  description,
  imageUrl,
  author,
  link,
  post,
  currentUser,
  onPostUpdate,
}) => {
  const content = (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors rounded-lg">
      {/* 文章图片 */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 文章内容 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{author}</span>
          
          {/* 管理菜单 - 只有有权限的用户才能看到 */}
          {post && currentUser && onPostUpdate && (
            <div className="flex items-center space-x-2">
              {/* 状态标签 */}
              {post.status && (
                <span className={`text-xs px-2 py-1 rounded ${
                  post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  post.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  post.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {post.status === 'PUBLISHED' ? '已发布' :
                   post.status === 'PENDING' ? '待审核' :
                   post.status === 'REJECTED' ? '已拒绝' :
                   post.status === 'DRAFT' ? '草稿' : '未知'}
                </span>
              )}
              
              {/* 管理按钮 */}
              <button
                className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-200 hover:border-blue-400 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // 这里可以打开管理菜单或跳转到管理页面
                  console.log('打开管理菜单', post.id);
                }}
              >
                管理
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default ForumPostItem; 