'use client';

import React, { useEffect, useState } from 'react';
import { List, Avatar, Tag, Button, Pagination } from 'antd';
import { EyeOutlined, MessageOutlined, StarOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface UserPost {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  createdAt: string;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  section: {
    id: number;
    name: string;
  };
}

const UserPostsPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PUBLISHED' | 'REJECTED'>('all');

  useEffect(() => {
    fetchUserPosts();
  }, [currentPage, pageSize, statusFilter]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });

      const response = await request(`/user/forum/posts?${params}`, {
        method: 'GET',
      });
      
      setPosts((response.data as { posts: UserPost[] }).posts || []);
      setTotal((response.data as { total: number }).total || 0);
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取帖子列表失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: UserPost) => {
    // 跳转到编辑页面
    router.push(`/forum/sections/${post.section.id}/post?edit=${post.id}`);
  };

  const handleDeletePost = async (postId: number) => {
    // 验证是否是自己的帖子
    const post = posts.find(p => p.id === postId);
    if (!post) {
      Swal.fire({
        icon: 'error',
        title: '帖子不存在',
        text: '该帖子可能已被删除',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    const result = await Swal.fire({
      title: '确认删除',
      text: '确定要删除这个帖子吗？删除后无法恢复。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        const response = await request(`/user/forum/posts/${postId}`, {
          method: 'DELETE',
        });
        
        if (response.code === 0) {
          Swal.fire({
            icon: 'success',
            title: '删除成功',
            text: '帖子已成功删除',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'top-end',
            toast: true
          });
          fetchUserPosts();
        } else {
          // 如果服务器返回错误，可能是权限问题
          if (response.message?.includes('权限') || response.message?.includes('own')) {
            Swal.fire({
              icon: 'error',
              title: '删除失败',
              text: '只能删除自己的帖子',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              position: 'top-end',
              toast: true
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: '删除失败',
              text: response.message || '删除失败',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              position: 'top-end',
              toast: true
            });
          }
        }
      } catch (error) {
        console.error('删除失败:', error);
        Swal.fire({
          icon: 'error',
          title: '删除失败',
          text: '删除失败，请稍后重试',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'PUBLISHED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '未审核';
      case 'PUBLISHED':
        return '已发布';
      case 'REJECTED':
        return '被拒绝';
      default:
        return '未知';
    }
  };

  const canEdit = (status: string) => {
    return status === 'PENDING' || status === 'REJECTED';
  };

  const canDelete = (status: string) => {
    return true; // 所有状态都可以删除
  };

  return (
    <div>
      {/* 状态筛选按钮 */}
      <div className="flex items-center justify-end space-x-3 mb-4">
        <Button 
          type={statusFilter === 'all' ? 'primary' : 'default'}
          onClick={() => setStatusFilter('all')}
          className="text-sm"
        >
          全部
        </Button>
        <Button 
          type={statusFilter === 'PENDING' ? 'primary' : 'default'}
          onClick={() => setStatusFilter('PENDING')}
          className="text-sm"
          style={{ backgroundColor: statusFilter === 'PENDING' ? '#ff7a45' : undefined, borderColor: statusFilter === 'PENDING' ? '#ff7a45' : undefined }}
        >
          未审核
        </Button>
        <Button 
          type={statusFilter === 'PUBLISHED' ? 'primary' : 'default'}
          onClick={() => setStatusFilter('PUBLISHED')}
          className="text-sm"
          style={{ backgroundColor: statusFilter === 'PUBLISHED' ? '#13c2c2' : undefined, borderColor: statusFilter === 'PUBLISHED' ? '#13c2c2' : undefined }}
        >
          已发布
        </Button>
        <Button 
          type={statusFilter === 'REJECTED' ? 'primary' : 'default'}
          onClick={() => setStatusFilter('REJECTED')}
          className="text-sm"
          style={{ backgroundColor: statusFilter === 'REJECTED' ? '#d46b08' : undefined, borderColor: statusFilter === 'REJECTED' ? '#d46b08' : undefined }}
        >
          被拒绝
        </Button>
      </div>

      {/* 帖子列表 */}
      <List
        loading={loading}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            actions={[
              canEdit(post.status) && (
                <Button 
                  key="edit" 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => handleEditPost(post)}
                >
                  编辑
                </Button>
              ),
              canDelete(post.status) && (
                <Button 
                  key="delete" 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeletePost(post.id)}
                >
                  删除
                </Button>
              )
            ].filter(Boolean)}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<span>U</span>}
                  className="bg-gray-200"
                />
              }
              title={
                <div className="flex items-center space-x-2">
                  <Tag color="blue">[{post.section.name}]</Tag>
                  <span className="text-gray-900">{post.title}</span>
                </div>
              }
              description={
                <div>
                  <div className="text-sm text-gray-500 mb-2">
                    作者: 精通linux开关机 {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      <EyeOutlined className="mr-1" />
                      {post.viewCount}
                    </span>
                    <span className="text-sm text-gray-500">
                      <MessageOutlined className="mr-1" />
                      {post.commentCount}
                    </span>
                    <span className="text-sm text-gray-500">
                      <StarOutlined className="mr-1" />
                      {post.likeCount}
                    </span>
                    <Tag color={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Tag>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: '暂无帖子'
        }}
      />

      {/* 分页 */}
      <div className="mt-6 flex justify-center">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          showSizeChanger
          showQuickJumper
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default UserPostsPage; 