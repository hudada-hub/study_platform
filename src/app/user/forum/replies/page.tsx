'use client';

import React, { useEffect, useState } from 'react';
import { List, Avatar, Tag, Button, Pagination } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { request } from '@/utils/request';
import Swal from 'sweetalert2';

interface UserReply {
  id: number;
  content: string;
  createdAt: string;
  post: {
    id: number;
    title: string;
    section: {
      id: number;
      name: string;
    };
  };
}

const UserRepliesPage = () => {
  const [replies, setReplies] = useState<UserReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchUserReplies();
  }, [currentPage, pageSize]);

  const fetchUserReplies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await request(`/user/forum/replies?${params}`, {
        method: 'GET',
      });
      
      setReplies((response.data as { replies: UserReply[] }).replies || []);
      setTotal((response.data as { total: number }).total || 0);
    } catch (error) {
      console.error('获取回复列表失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取回复列表失败',
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

  const handleDeleteReply = async (replyId: number) => {
    // 验证是否是自己的回复
    const reply = replies.find(r => r.id === replyId);
    if (!reply) {
      Swal.fire({
        icon: 'error',
        title: '回复不存在',
        text: '该回复可能已被删除',
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
      text: '确定要删除这个回复吗？删除后无法恢复。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        const response = await request(`/user/forum/replies/${replyId}`, {
          method: 'DELETE',
        });
        
        if (response.code === 0) {
          Swal.fire({
            icon: 'success',
            title: '删除成功',
            text: '回复已成功删除',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'top-end',
            toast: true
          });
          fetchUserReplies();
        } else {
          // 如果服务器返回错误，可能是权限问题
          if (response.message?.includes('权限') || response.message?.includes('own')) {
            Swal.fire({
              icon: 'error',
              title: '删除失败',
              text: '只能删除自己的回复',
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

  return (
    <div>
      {/* 回复列表 */}
      <List
        loading={loading}
        dataSource={replies}
        renderItem={(reply) => (
          <List.Item
            actions={[
              <Button 
                key="delete" 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteReply(reply.id)}
              >
                删除
              </Button>
            ]}
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
                  <Tag color="blue">[{reply.post.section.name}]</Tag>
                  <span className="text-gray-900">{reply.post.title}</span>
                </div>
              }
              description={
                <div>
                  <div 
                    className="text-sm text-gray-500 mb-2 line-clamp-2 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />
                  <div className="text-sm text-gray-500">
                    {new Date(reply.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: '暂无回复'
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

export default UserRepliesPage; 