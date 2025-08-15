'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, List, Avatar, Tag, Space, Button } from 'antd';
import Swal from 'sweetalert2';
import { EyeOutlined, MessageOutlined, StarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import Link from 'next/link';

interface FavoritePost {
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
    avatar?: string;
  };
  section: {
    id: number;
    name: string;
  };
}

interface FavoriteSection {
  id: number;
  name: string;
  description: string;
  postCount: number;
  favoriteCount: number;
  createdAt: string;
  moderator: {
    id: number;
    nickname: string;
  };
}

const ForumTab: React.FC = () => {
  const [activeKey, setActiveKey] = useState('posts');
  const [favoritePosts, setFavoritePosts] = useState<FavoritePost[]>([]);
  const [favoriteSections, setFavoriteSections] = useState<FavoriteSection[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  useEffect(() => {
    if (activeKey === 'posts') {
      fetchFavoritePosts();
    } else {
      fetchFavoriteSections();
    }
  }, [activeKey]);

  const fetchFavoritePosts = async () => {
    try {
      setPostsLoading(true);
      const response = await request('/user/favorites/posts', {
        method: 'GET',
      });
      setFavoritePosts((response.data as FavoritePost[]) || []);
    } catch (error) {
      console.error('获取收藏帖子失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取收藏帖子失败',
        text: '请稍后重试',
      });
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchFavoriteSections = async () => {
    try {
      setSectionsLoading(true);
      const response = await request('/user/favorites/sections', {
        method: 'GET',
      });
      setFavoriteSections((response.data as FavoriteSection[]) || []);
    } catch (error) {
      console.error('获取收藏板块失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取收藏板块失败',
        text: '请稍后重试',
      });
    } finally {
      setSectionsLoading(false);
    }
  };

  const handleRemovePostFavorite = async (postId: number) => {
    try {
      await request(`/forum/posts/${postId}/favorite`, {
        method: 'DELETE',
      });
      Swal.fire({
        icon: 'success',
        title: '取消收藏成功',
        text: '已取消收藏该帖子',
      });
      fetchFavoritePosts();
    } catch (error) {
      console.error('取消收藏失败:', error);
      Swal.fire({
        icon: 'error',
        title: '取消收藏失败',
        text: '请稍后重试',
      });
    }
  };

  const handleRemoveSectionFavorite = async (sectionId: number) => {
    try {
      await request(`/forum/sections/${sectionId}/favorite`, {
        method: 'DELETE',
      });
      Swal.fire({
        icon: 'success',
        title: '取消收藏成功',
        text: '已取消收藏该板块',
      });
      fetchFavoriteSections();
    } catch (error) {
      console.error('取消收藏失败:', error);
      Swal.fire({
        icon: 'error',
        title: '取消收藏失败',
        text: '请稍后重试',
      });
    }
  };

  const items = [
    {
      key: 'posts',
      label: '帖子收藏',
      children: (
        <List
          loading={postsLoading}
          dataSource={favoritePosts}
          renderItem={(post) => (
            <List.Item
              actions={[
                <Button 
                  key="remove" 
                  type="text" 
                  danger 
                  onClick={() => handleRemovePostFavorite(post.id)}
                >
                  取消收藏
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    src={post.author.avatar} 
                    icon={<span>{post.author.nickname.charAt(0)}</span>}
                  />
                }
                title={
                  <Link href={`/forum/posts/${post.id}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                }
                description={
                  <div>
                    <div className="text-gray-600 mb-2">
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 100)}...` 
                        : post.content
                      }
                    </div>
                    <Space size="small">
                      <Tag color="blue">{post.section.name}</Tag>
                      <span className="text-gray-500">
                        <ClockCircleOutlined className="mr-1" />
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </Space>
                    <div className="mt-2 space-x-4 text-sm text-gray-500">
                      <span>
                        <EyeOutlined className="mr-1" />
                        {post.viewCount} 浏览
                      </span>
                      <span>
                        <MessageOutlined className="mr-1" />
                        {post.commentCount} 回复
                      </span>
                      <span>
                        <StarOutlined className="mr-1" />
                        {post.likeCount} 点赞
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: '暂无收藏的帖子'
          }}
        />
      ),
    },
    {
      key: 'sections',
      label: '板块收藏',
      children: (
        <List
          loading={sectionsLoading}
          dataSource={favoriteSections}
          renderItem={(section) => (
            <List.Item
              actions={[
                <Button 
                  key="remove" 
                  type="text" 
                  danger 
                  onClick={() => handleRemoveSectionFavorite(section.id)}
                >
                  取消收藏
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<UserOutlined />}
                    className="bg-blue-500"
                  />
                }
                title={
                  <Link href={`/forum/sections/${section.id}`} className="text-blue-600 hover:text-blue-800">
                    {section.name}
                  </Link>
                }
                description={
                  <div>
                    <div className="text-gray-600 mb-2">
                      {section.description}
                    </div>
                    <Space size="small">
                      <Tag color="green">板块</Tag>
                      <span className="text-gray-500">
                        <ClockCircleOutlined className="mr-1" />
                        {new Date(section.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </Space>
                    <div className="mt-2 space-x-4 text-sm text-gray-500">
                      <span>
                        <MessageOutlined className="mr-1" />
                        {section.postCount} 帖子
                      </span>
                      <span>
                        <StarOutlined className="mr-1" />
                        {section.favoriteCount} 收藏
                      </span>
                      <span>
                        <UserOutlined className="mr-1" />
                        版主: {section.moderator.nickname}
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: '暂无收藏的板块'
          }}
        />
      ),
    },
  ];

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      items={items}
    />
  );
};

export default ForumTab; 