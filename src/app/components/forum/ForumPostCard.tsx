import React from 'react';
import { Card, Avatar, Tag } from 'antd';
import { EyeOutlined, MessageOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { ForumPost } from '../home/ForumSection';



interface ForumPostCardProps {
  post: ForumPost;
  className?: string;
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, className = '' }) => {
  // 格式化时间
  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return '今天';
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 去除HTML标签的函数
  const stripHtml = (html: string) => {
    if (typeof window !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    }
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <Link href={`/forum/posts/${post.id}`}>
      <Card
        hoverable
        className={`mb-4 transition-all duration-300  ${className}`}
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex items-start space-x-3">
          {/* 头像 */}
        
          
          {/* 内容区域 */}
          <div className="flex-1 min-w-0 flex items-center">
            {/* 标签和标题 */}
            <div className="flex items-center gap-2">
              {post.isTop && <Tag color="red">置顶</Tag>}
              {post.isEssence && <Tag color="orange">精华</Tag>}
              {post.isHot && <Tag color="volcano">热门</Tag>}
              <Tag color="blue">{post.section.name}</Tag>
            </div>
            {/* <Avatar 
            src={post.author.avatar} 
            size={40}
            className="flex-shrink-0"
          /> */}
            {/* 标题和底部信息放在一行 */}
            <div className="flex items-center flex-1 justify-between">
              <h3 className="text-base font-normal text-gray-900 line-clamp-1 flex-1 mr-4">
                {post.title}
              </h3>
              
              {/* 底部信息 */}
              <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
                {/* 左侧：作者和时间 */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <UserOutlined className="mr-1" />
                    {post.author?.nickname || '匿名用户'}
                  </div>
                  <div className="flex items-center">
                    <ClockCircleOutlined className="mr-1" />
                    {formatTime(post.createdAt)}
                  </div>
                </div>
                
                {/* 右侧：浏览量和评论数 */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <EyeOutlined className="mr-1" />
                    {post.viewCount}
                  </div>
                  <div className="flex items-center">
                    <MessageOutlined className="mr-1" />
                    {post.commentCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ForumPostCard; 