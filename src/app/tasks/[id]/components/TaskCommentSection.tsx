'use client';

import { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import UserAvatar from '@/app/components/common/UserAvatar';
import { ArrowUpOnSquareIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ResponseCode } from '@/utils/response';
import { CommentInput } from '@/app/components/common/CommentInput';
import { useTheme } from '@/providers/theme-provider';
import { Image, Pagination } from 'antd';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    nickname: string;
    avatar: string;
  };
  parentId: number | null;
  replies: Comment[];
  likesCount: number;
  hasLiked: boolean;
  likeCount: number; // API返回的字段
  dislikeCount: number; // API返回的字段
  pics: string[];
  likes: any[]; // API返回的点赞用户列表
  parentComment?: {
    id: number;
    content: string;
    author: {
      id: number;
      nickname: string;
    };
  };
}

interface LikeResponse {
  hasLiked: boolean;
  likesCount: number;
}

interface TaskCommentSectionProps {
  taskId: number;
}

export const TaskCommentSection = ({ taskId }: TaskCommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { theme } = useTheme();

  // 处理评论数据，API已经返回树状结构，这里需要处理点赞信息
  const processComments = (comments: Comment[]) => {
    return comments.map(comment => ({
      ...comment,
      // 使用API返回的likeCount，如果没有则使用likesCount
      likesCount: comment.likeCount || comment.likesCount || 0,
      // 确保pics是数组
      pics: Array.isArray(comment.pics) ? comment.pics : [],
      // 处理回复的点赞信息
      replies: (comment.replies || []).map(reply => ({
        ...reply,
        likesCount: reply.likeCount || reply.likesCount || 0,
        pics: Array.isArray(reply.pics) ? reply.pics : [],
      })),
    }));
  };

  const fetchComments = async (page = 1) => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      

      const res = await request<{
        items: Comment[];
        total: number;
        page: number;
        pageSize: number;
      }>(`/tasks/${taskId}/comments?${queryParams.toString()}`);
      console.log(res);
      if (res.code === ResponseCode.SUCCESS && res.data) {
        const processedData = processComments(res.data.items);
        console.log(processedData,'processedData')
        setComments(processedData);
        setTotalComments(res.data.total);
     
      }
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchComments(currentPage);
    }
  }, [taskId, currentPage, pageSize]);

  // 处理分页变化
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
    // 滚动到评论区域顶部
    const commentSection = document.querySelector('.comment-section');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 处理评论提交
  const handleSubmitComment = async (content: string, images?: string[]) => {
    if (!content.trim() && (!images || images.length === 0)) return;
    try {
      await request(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          parentId: replyingTo?.id || null,
          pics: images || []
        })
      });
      setReplyingTo(null);
      fetchComments(currentPage); // 刷新评论列表
    } catch (error) {
      console.error('提交评论失败:', error);
    }
  };

  // 处理点赞
  const handleLike = async (comment: Comment) => {
    try {
      setLikingCommentId(comment.id);
      const res = await request<LikeResponse>(`/task-comments/${comment.id}/like`, {
        method: 'POST'
      });
      console.log(res);
      const likeData = res.data as LikeResponse | undefined;
      if (res.code === ResponseCode.SUCCESS && likeData) {
        // 更新评论列表中的点赞状态和数量
        const updateCommentLike = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === comment.id) {
              return {
                ...c,
                hasLiked: likeData.hasLiked,
                likesCount: likeData.likesCount
              };
            }
            if (c.replies?.length > 0) {
              return {
                ...c,
                replies: updateCommentLike(c.replies)
              };
            }
            return c;
          });
        };
        setComments(prev => updateCommentLike(prev));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    } finally {
      setLikingCommentId(null);
    }
  };

  // 递归渲染评论
  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`mb-6 p-4 bg-white rounded-lg ${depth > 0 ? 'border-l-4 border-gray-200 ml-4' : ''}`}>
      {/* 回复提示 */}
      {comment.parentComment && (
        <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
          回复 <span className="font-medium">{comment.parentComment?.author?.nickname}</span>: {comment.parentComment?.content}
        </div>
      )}
      
      <div className="flex items-center mb-3 gap-3">
        <UserAvatar avatarUrl={comment.author?.avatar} size="sm" />
        <div>
          <div className="text-sm text-gray-900 font-medium">{comment.author?.nickname}</div>
          <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <p className="mb-3 text-gray-700">{comment.content}</p>
      {/* 评论图片展示 */}
      {Array.isArray(comment.pics) && comment.pics.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <Image.PreviewGroup>
            {comment.pics.map((pic, idx) => (
              <Image
                key={idx}
                src={pic}
                alt="评论图片"
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
                className="hover:scale-105 transition-transform"
                preview={true}
              />
            ))}
          </Image.PreviewGroup>
        </div>
      )}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={() => setReplyingTo(comment)}
          className="flex items-center gap-1 hover:text-cyan-500 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          回复
        </button>
        <button
          onClick={() => handleLike(comment)}
          disabled={likingCommentId === comment.id}
          className={`flex items-center gap-1 ${comment.hasLiked ? 'text-cyan-500' : 'hover:text-cyan-500'} transition-colors`}
        >
          <ArrowUpOnSquareIcon className={`w-4 h-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
          {comment.likesCount}
        </button>
      </div>
      {comment?.replies?.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  // 评论骨架屏组件
  const CommentSkeleton: React.FC = () => (
    <div className="mb-4 p-4 bg-white rounded-lg flex gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
        <div className="flex gap-2 mb-2">
          <div className="w-20 h-20 bg-gray-100 rounded" />
          <div className="w-20 h-20 bg-gray-100 rounded" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );

 
  if(loading){
    return <div>
      <CommentSkeleton />
    </div>
  }

  return (
    <div className="mt-12 comment-section">
      <h2 className="text-xl font-bold mb-6 flex text-gray-900">
        评论 ({totalComments})
      </h2>
      {/* 评论输入框 */}
      <div className="mb-8 bg-white p-4 rounded-lg">
        <CommentInput
          onSubmit={handleSubmitComment}
          replyingTo={replyingTo ? { username: replyingTo.author.nickname } : undefined}
          onCancelReply={() => setReplyingTo(null)}
          avatarUrl="/default-avatar.png"
        />
      </div>
      {/* 评论列表 */}
      {loading ? (
        <div>
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="p-4 bg-white rounded-lg text-center text-gray-400">
          暂无评论，快来发表第一个评论吧！
        </div>
      ) : (
        <>
          <div>{comments.map(comment => renderComment(comment))}</div>
          {/* 分页组件 */}
          {totalComments > pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={totalComments}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条评论`
                }
                pageSizeOptions={['5', '10', '20', '50']}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}; 