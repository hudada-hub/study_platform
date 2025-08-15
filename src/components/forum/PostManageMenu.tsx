'use client';

import React, { useState } from 'react';
import { Dropdown, Button, message, Modal } from 'antd';
import { MoreOutlined, CrownOutlined, FireOutlined, StarOutlined, CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { ForumPost } from '@/types/forum';
import { request } from '@/utils/request';
import { canManagePost } from '@/utils/permissions';
import { User } from '@prisma/client';
import Swal from 'sweetalert2';
import { ClientUser } from '@/utils/client-auth';

interface PostManageMenuProps {
  post: ForumPost;
  currentUser: ClientUser | null;
  onPostUpdate: (updatedPost: ForumPost) => void;
}

const PostManageMenu: React.FC<PostManageMenuProps> = ({
  post,
  currentUser,
  onPostUpdate
}) => {
  const [loading, setLoading] = useState(false);

  // 调试信息
  console.log('PostManageMenu render:', {
    currentUser: currentUser,
    currentUserRole: currentUser?.role,
    currentUserId: currentUser?.id,
    postId: post.id,
    sectionModeratorId: post.section?.moderatorId,
    hasPermission: canManagePost(currentUser, post.section?.moderatorId),
    canManagePostResult: canManagePost(currentUser, post.section?.moderatorId)
  });

  // 检查是否有管理权限
  if (!canManagePost(currentUser, post.section?.moderatorId)) {
    console.log('权限不足，不显示管理菜单', {
      currentUser: currentUser,
      sectionModeratorId: post.section?.moderatorId,
      canManagePostResult: canManagePost(currentUser, post.section?.moderatorId)
    });
    return null;
  }

  const handleStatusChange = async (status: string) => {
    try {
      setLoading(true);
      const response = await request(`/forum/posts/${post.id}/manage`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });

      if (response.code === 0) {
        message.success('状态更新成功');
        onPostUpdate(response.data as ForumPost);
      } else {
        message.error(response.message || '状态更新失败');
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProperty = async (property: 'isTop' | 'isEssence' | 'isHot') => {
    try {
      setLoading(true);
      const updateData = { [property]: !post[property] };
      
      const response = await request(`/forum/posts/${post.id}/manage`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response.code === 0) {
        message.success('设置更新成功');
        onPostUpdate(response.data as ForumPost);
      } else {
        message.error(response.message || '设置更新失败');
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '确认删除',
      text: '确定要删除这个帖子吗？此操作不可恢复。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const response = await request(`/forum/posts/${post.id}/manage`, {
          method: 'DELETE'
        });

        if (response.code === 0) {
          message.success('帖子删除成功');
          // 这里可以触发页面刷新或从列表中移除
          window.location.reload();
        } else {
          message.error(response.message || '删除失败');
        }
      } catch (error) {
        message.error('删除失败');
      } finally {
        setLoading(false);
      }
    }
  };

  const menuItems = [
    // 状态管理
    {
      key: 'status',
      label: '状态管理',
      children: [
        {
          key: 'published',
          label: '通过审核',
          icon: <CheckCircleOutlined />,
          onClick: () => handleStatusChange('PUBLISHED'),
          disabled: post.status === 'PUBLISHED'
        },
        {
          key: 'rejected',
          label: '拒绝',
          icon: <CloseCircleOutlined />,
          onClick: () => handleStatusChange('REJECTED'),
          disabled: post.status === 'REJECTED'
        },
        {
          key: 'pending',
          label: '待审核',
          icon: <ClockCircleOutlined />,
          onClick: () => handleStatusChange('PENDING'),
          disabled: post.status === 'PENDING'
        }
      ]
    },
    // 属性设置
    {
      key: 'properties',
      label: '属性设置',
      children: [
        {
          key: 'isTop',
          label: post.isTop ? '取消置顶' : '设为置顶',
          icon: <CrownOutlined />,
          onClick: () => handleToggleProperty('isTop')
        },
        {
          key: 'isEssence',
          label: post.isEssence ? '取消精华' : '设为精华',
          icon: <StarOutlined />,
          onClick: () => handleToggleProperty('isEssence')
        },
        {
          key: 'isHot',
          label: post.isHot ? '取消热门' : '设为热门',
          icon: <FireOutlined />,
          onClick: () => handleToggleProperty('isHot')
        }
      ]
    },
    // 删除操作
    {
      key: 'delete',
      label: '删除帖子',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDelete
    }
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
      disabled={loading}
    >
      <Button
        type="text"
        icon={<MoreOutlined />}
        size="small"
        className="text-gray-400 hover:text-gray-600"
        loading={loading}
      />
    </Dropdown>
  );
};

export default PostManageMenu; 