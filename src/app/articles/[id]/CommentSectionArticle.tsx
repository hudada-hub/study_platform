'use client';

import { useState, useEffect, useCallback } from 'react';
import { request } from '@/utils/request';
import UserAvatar from '@/app/components/common/UserAvatar';
import { ArrowUpOnSquareIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { ResponseCode } from '@/utils/response';
import { useParams } from 'next/navigation';
import { CommentInput } from '@/app/components/common/CommentInput';
import Image from 'next/image';
import { useTheme } from '@/providers/theme-provider';
interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  parentCommentId: number | null;
  replies: Comment[];
  likeCount: number;
  isLiked: boolean;
  parentComment?: Comment; // Added parentComment property
}

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

interface CommentSectionProps {
  articleId?: number;
  isDetail?: boolean;
  wikiId?: number;
}

export const CommentSectionArticle = ({ articleId,isDetail,wikiId }: CommentSectionProps) => {
  const params = useParams<{ moduleName: string; wikiName: string; detailName: string }>()
  const {moduleName,wikiName,detailName} = params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [showComment,setShowComment] = useState(false);
  const {theme} = useTheme();
  // 获取评论列表
  // 将扁平化评论数组转换为树状结构
  const buildCommentTree = (comments: Comment[]) => {
    // 创建一个 Map 来存储所有评论，方便查找
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // 第一次遍历：将所有评论添加到 Map 中
    comments.forEach(comment => {
      // 创建一个新对象，确保 replies 数组存在
      const commentWithReplies = {
        ...comment,
        replies: []
      };
      commentMap.set(comment.id, commentWithReplies);
    });

    // 第二次遍历：构建树形结构
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentCommentId === null) {
        // 这是一个根评论
        rootComments.push(commentWithReplies);
      } else {
        // 这是一个回复
        const parentComment = commentMap.get(comment.parentCommentId);
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

 

  const fetchArticleComments = async () => {
    setLoading(true);
    try {
      const res = await request<Comment[]>(`/articles/${articleId}/comments`);
      if (res.code === ResponseCode.SUCCESS && res.data) {
        const treeData = buildCommentTree(res.data);
        setComments(treeData);
        setTotalComments(res.data.length); // 使用原始数据的长度
        setShowComment(true);
      }
    }catch(error){
      setShowComment(false);
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDetailComments =async () => {
    setLoading(true);
    try {
      const res = await request<Comment[]>(`/details/comments`,{
        method:'POST',
        body:JSON.stringify({
          wikiId,
          moduleName:decodeURIComponent(moduleName),
          detailName:decodeURIComponent(detailName)
        })
      });
      if (res.code === ResponseCode.SUCCESS && res.data) {
        const treeData = buildCommentTree(res.data);
     
        setComments(treeData);
        setTotalComments(res.data.length); // 使用原始数据的长度
        setShowComment(true);
      }
    }catch(error){
      setShowComment(false);
        console.error('获取评论失败:', error);
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(articleId) fetchArticleComments(); }, [articleId]);
  useEffect(() => { 
 
    
    if(isDetail&&wikiId){
    try{
      fetchDetailComments();
    }catch(error){
      console.error('获取评论失败:', error);
    }

  } }, [isDetail]);

  const handleSubmitComment = async (content: string) => {
    if(isDetail){
      await handleDetailSubmitComment(content);
    }else{
      await handleArticleSubmitComment(content);
    }
  }
  // 处理评论提交
  const handleArticleSubmitComment = async (content: string) => {
    if (!content.trim()) return;

    try {
      await request(`/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          articleId,
          parentCommentId: replyingTo?.id
        })
      });
      setReplyingTo(null);
      fetchArticleComments(); // 刷新评论列表
    } catch (error) {
      console.error('提交评论失败:', error);
    }
  };
  const handleDetailSubmitComment = async (content: string) => {
    if (!content.trim()) return;

    try {
      await request(`/details/comments/submit`, {
        method: 'POST',
        body: JSON.stringify({
          content,
          wikiId,
          moduleName:decodeURIComponent(moduleName),
          detailName:decodeURIComponent(detailName),
          parentCommentId: replyingTo?.id
        })
      });
      setReplyingTo(null);
      fetchDetailComments(); // 修改为调用 fetchDetailComments
    } catch (error) {
      console.error('提交评论失败:', error);
    }
  };
  // 处理点赞
  const handleLike = async (comment: Comment) => {
    try {
      setLikingCommentId(comment.id);
      const res = await request<LikeResponse>(`/comments/${comment.id}/like`, {
        method: 'POST'
      });
      const likeData = res.data as LikeResponse | undefined;
      if (res.code === ResponseCode.SUCCESS && likeData) {
        // 更新评论列表中的点赞状态和数量
        const updateCommentLike = (comments: Comment[]): Comment[] => {
          return comments.map(c => {
            if (c.id === comment.id) {
              return {
                ...c,
                isLiked: likeData.liked,
                likeCount: likeData.likeCount
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
    <div key={comment.id} className={`ml-${depth * 4} mb-6 p-4 bg-white rounded-lg  ${depth > 0 ? 'border-l-4 border-blue-100' : ''}`}>
      <div className="flex items-center mb-3 gap-3">
        <UserAvatar avatarUrl={comment.user.avatar} size="sm" />
        <div>
          <div className="text-sm font-medium">{comment.user.username}</div>
          <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
      </div>
      <p className="mb-3 text-gray-700">{comment.content}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={() => setReplyingTo(comment)}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <ChatBubbleLeftRightIcon className="w-4 h-4" />
          回复
        </button>
        <button
          onClick={() => handleLike(comment)}
          disabled={likingCommentId === comment.id}
          style={{color:comment.isLiked ?theme.textColor.primary:'#000'}}
          className={`flex items-center gap-1`}
        >
          <ArrowUpOnSquareIcon className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
          {comment.likeCount}
        </button>
      </div>
      {comment?.replies?.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if(!showComment){
    return <div>
      
    </div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 flex"> <Image src="/prefix-1.png" alt="comment"  width={16} className='mr-2' height={30} /> 评论 ({totalComments})</h2>

      {/* 评论输入框 */}
      <div className="mb-8">
        <CommentInput
          onSubmit={handleSubmitComment}
          replyingTo={replyingTo ? { username: replyingTo.user.username } : undefined}
          onCancelReply={() => setReplyingTo(null)}
          avatarUrl="/default-avatar.png"
        />
      </div>

      {/* 评论列表 */}
      {loading ? (
        <div className="animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="mb-4 p-4 bg-white rounded-lg "><div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div><div className="h-3 bg-gray-200 rounded mb-1"></div><div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>)}</div>
      ) : comments.length === 0 ? (
        <div className="p-4 bg-white rounded-lg text-center text-gray-500">暂无评论，快来发表第一个评论吧！</div>
      ) : (
        <div>{comments.map(comment => renderComment(comment))}</div>
      )}
    </div>
  );
};
