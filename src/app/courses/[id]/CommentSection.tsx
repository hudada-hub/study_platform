'use client';

import { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import UserAvatar from '@/app/components/common/UserAvatar';
import { ArrowUpOnSquareIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ResponseCode } from '@/utils/response';
import { CommentInput } from '@/app/components/common/CommentInput';
import Image from 'next/image';
import { useTheme } from '@/providers/theme-provider';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;  // 使用 nickname 而不是 username
    avatar: string;
  };
  parentId: number | null;
  replies: Comment[];
  likesCount: number;
  hasLiked: boolean;
  parentComment?: Comment;
}

interface LikeResponse {
  hasLiked: boolean;
  likesCount: number;
}

interface CommentSectionProps {
  courseId: number;
}

export const CommentSection = ({ courseId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [showComment, setShowComment] = useState(false);
  const { theme } = useTheme();

  // 将扁平化评论数组转换为树状结构
  const buildCommentTree = (comments: Comment[]) => {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    comments.forEach(comment => {
      const commentWithReplies = {
        ...comment,
        replies: []
      };
      commentMap.set(comment.id, commentWithReplies);
    });

    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId === null) {
        rootComments.push(commentWithReplies);
      } else {
        const parentComment = commentMap.get(comment.parentId!);
        if (parentComment) {
          parentComment.replies.push(commentWithReplies);
        }
      }
    });

    // 按时间倒序排序
    const sortByTime = (comments: Comment[]) => {
      comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      comments.forEach(comment => {
        if (comment.replies.length > 0) {
          sortByTime(comment.replies);
        }
      });
    };

    sortByTime(rootComments);
    return rootComments;
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams({
        courseId: courseId.toString()
      });
      

      const res = await request<{
        items: Comment[];
        total: number;
        page: number;
        pageSize: number;
      }>(`/course-comments?${queryParams.toString()}`);
      console.log(res);
      if (res.code === ResponseCode.SUCCESS && res.data) {
        const treeData = buildCommentTree(res.data.items);
        
        setComments(treeData);
        setTotalComments(res.data.total);
        setShowComment(true);
      }
    } catch (error) {
      setShowComment(false);
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchComments();
    }
  }, [courseId]);

  // 处理评论提交
  const handleSubmitComment = async (content: string) => {
    if (!content.trim()) return;

    try {
      await request('/course-comments', {
        method: 'POST',
        body: JSON.stringify({
          content,
          courseId,
          parentId: replyingTo?.id
        })
      });
      setReplyingTo(null);
      fetchComments(); // 刷新评论列表
    } catch (error) {
      console.error('提交评论失败:', error);
    }
  };

  // 处理点赞
  const handleLike = async (comment: Comment) => {
    try {
      setLikingCommentId(comment.id);
      const res = await request<LikeResponse>(`/course-comments/${comment.id}/like`, {
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
    <div key={comment.id} className={`ml-${depth * 4} mb-6 p-4 bg-white rounded-lg ${depth > 0 ? 'border-l-4 border-gray-200' : ''}`}>
      <div className="flex items-center mb-3 gap-3">
        <UserAvatar avatarUrl={comment.user.avatar} size="sm" />
        <div>
          <div className="text-sm text-gray-900 font-medium">{comment.user.nickname}</div>
          <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <p className="mb-3 text-gray-700">{comment.content}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={() => setReplyingTo(comment)}
          className="flex items-center gap-1 hover:text-orange-500 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          回复
        </button>
        <button
          onClick={() => handleLike(comment)}
          disabled={likingCommentId === comment.id}
          className={`flex items-center gap-1 ${comment.hasLiked ? 'text-orange-500' : 'hover:text-orange-500'} transition-colors`}
        >
          <ArrowUpOnSquareIcon className={`w-4 h-4 ${comment.hasLiked ? 'fill-current' : ''}`} />
          {comment.likesCount}
        </button>
      </div>
      {comment?.replies?.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (!showComment) {
    return <div></div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 flex text-gray-900">
        <Image src="/prefix-1.png" alt="comment" width={16} className="mr-2" height={30} />
        评论 ({totalComments})
      </h2>
      {/* 评论输入框 */}
      <div className="mb-8 bg-white p-4 rounded-lg">
        <CommentInput
          onSubmit={handleSubmitComment}
          replyingTo={replyingTo ? { username: replyingTo.user.nickname } : undefined}
          onCancelReply={() => setReplyingTo(null)}
          avatarUrl="/default-avatar.png"
        />
      </div>
      {/* 评论列表 */}
      {loading ? (
        <div className="animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-4 p-4 bg-white rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="p-4 bg-white rounded-lg text-center text-gray-400">
          暂无评论，快来发表第一个评论吧！
        </div>
      ) : (
        <div>{comments.map(comment => renderComment(comment))}</div>
      )}
    </div>
  );
}; 