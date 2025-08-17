'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiStar, FiMessageSquare, FiThumbsUp, FiThumbsDown, FiPlus, FiMail, FiFlag, FiCornerUpLeft } from 'react-icons/fi';
import { ForumComment } from '@/types/forum';
import { request } from '@/utils/request';
import { Modal, Input, Button } from 'antd';
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';

const OptimizedWangEditor = dynamic(() => import('@/app/components/template/OptimizedWangEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-32 bg-gray-100 rounded animate-pulse flex items-center justify-center">加载编辑器中...</div>
});

interface ForumCommentItemProps {
  comment: ForumComment;
  index: number;
  onReply: (commentId: number) => void;
  onSupport: (commentId: number) => void;
  onOppose: (commentId: number) => void;
  onReplySubmit?: (commentId: number, content: string) => void;
}

const ForumCommentItem: React.FC<ForumCommentItemProps> = ({
  comment,
  index,
  onReply,
  onSupport,
  onOppose,
  onReplySubmit,
}) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [isDisliked, setIsDisliked] = useState(comment.isDisliked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount || 0);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  // 当comment的isLiked或isDisliked状态变化时更新本地状态
  useEffect(() => {
    setIsLiked(comment.isLiked || false);
    setIsDisliked(comment.isDisliked || false);
    setLikeCount(comment.likeCount || 0);
    setDislikeCount(comment.dislikeCount || 0);
  }, [comment.isLiked, comment.isDisliked, comment.likeCount, comment.dislikeCount]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSupport = async (commentId: number) => {
    try {
      if (isLiked) {
        // 取消点赞
        await request(`/forum/comments/${commentId}/like`, { method: 'DELETE' });
        setIsLiked(false);
        setLikeCount((prev: number) => Math.max(0, prev - 1));
        Swal.fire({
          icon: 'success',
          title: '取消点赞成功',
          text: '已取消点赞该评论',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        // 点赞
        await request(`/forum/comments/${commentId}/like`, { method: 'POST' });
        setIsLiked(true);
        setLikeCount((prev: number) => prev + 1);
        Swal.fire({
          icon: 'success',
          title: '点赞成功',
          text: '已成功点赞该评论',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      Swal.fire({
        icon: 'error',
        title: '操作失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    }
  };

  const handleOppose = async (commentId: number) => {
    try {
      if (isDisliked) {
        // 取消反对
        await request(`/forum/comments/${commentId}/dislike`, { method: 'DELETE' });
        setIsDisliked(false);
        setDislikeCount((prev: number) => Math.max(0, prev - 1));
        Swal.fire({
          icon: 'success',
          title: '取消反对成功',
          text: '已取消反对该评论',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        // 反对
        await request(`/forum/comments/${commentId}/dislike`, { method: 'POST' });
        setIsDisliked(true);
        setDislikeCount((prev: number) => prev + 1);
        Swal.fire({
          icon: 'success',
          title: '反对成功',
          text: '已成功反对该评论',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error) {
      console.error('反对操作失败:', error);
      Swal.fire({
        icon: 'error',
        title: '操作失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    }
  };

  const handleReport = async () => {
    if (!reportContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入举报原因',
        text: '请详细说明举报原因',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    try {
      await request(`/forum/comments/${comment.id}/report`, {
        method: 'POST',
        body: JSON.stringify({ content: reportContent }),
      });
      Swal.fire({
        icon: 'success',
        title: '举报成功',
        text: '您的举报已提交，我们会尽快处理',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      setReportModalVisible(false);
      setReportContent('');
    } catch (error) {
      console.error('举报失败:', error);
      Swal.fire({
        icon: 'error',
        title: '举报失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    }
  };

  const handleReplyClick = () => {
    setShowReplyEditor(!showReplyEditor);
    // 移除跳转到底部的逻辑，直接在评论下方显示回复编辑器
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入回复内容',
        text: '请填写回复内容后再提交',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    setReplyLoading(true);
    try {
      const response = await request(`/forum/comments/${comment.id}/replies`, {
        method: 'POST',
        body: JSON.stringify({ content: replyContent }),
      });

      if (response.code === 0) {
        Swal.fire({
          icon: 'success',
          title: '回复成功',
          text: '您的回复已成功发表',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
        setShowReplyEditor(false);
        setReplyContent('');
        // 刷新页面以显示新回复
        window.location.reload();
      }
    } catch (error) {
      console.error('回复失败:', error);
      Swal.fire({
        icon: 'error',
        title: '回复失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4">
      <div className="flex">
        {/* 左侧用户信息栏 */}
        <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
          <div className="text-center">
            {/* 用户名 */}
            <div className="text-lg font-medium text-gray-900 mb-2">
              {comment.author?.nickname || '匿名用户'}
            </div>
            
            {/* 用户头像 */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
              {comment.author?.avatar ? (
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.nickname || '用户头像'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            {/* 用户称号 */}
            <div className="flex items-center justify-center mb-2">
              <span className="text-sm text-gray-600">
                {comment.author?.nickname || '匿名用户'}
              </span>
              <FiStar className="w-4 h-4 text-yellow-500 ml-1" />
            </div>
            

            
            {/* 统计数据 */}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>主题</span>
                <span>{comment.author?.postCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>帖子</span>
                <span>{comment.author?.commentCount || 0}</span>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              注册时间 {comment.author?.createdAt ? new Date(comment.author.createdAt).toLocaleDateString('zh-CN') : '未知'}
            </div>
          </div>
        </div>

        {/* 右侧回复内容区域 */}
        <div className="flex-1 p-4">
          {/* 回复头部 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>发表于 {formatDate(comment.createdAt)}</span>
              <span>只看该作者</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                沙发
              </button>
            </div>
          </div>

          {/* 回复内容 */}
          <div className="mb-4">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          </div>

          {/* 回复底部操作栏 */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReplyClick}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <FiCornerUpLeft className="w-4 h-4" />
                <span>回复</span>
              </button>
              <button
                onClick={() => handleSupport(comment.id)}
                className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                  isLiked 
                    ? 'text-green-600' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <FiThumbsUp className="w-4 h-4" />
                <span>支持 ({likeCount})</span>
              </button>
              <button
                onClick={() => handleOppose(comment.id)}
                className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                  isDisliked 
                    ? 'text-red-600' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FiThumbsDown className="w-4 h-4" />
                <span>反对 ({dislikeCount})</span>
              </button>
              <button
                onClick={() => setReportModalVisible(true)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
              >
                <FiFlag className="w-4 h-4" />
                <span>举报</span>
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              #{index + 1}楼
            </div>
          </div>

          {/* 二级回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 border-l-2 border-gray-200 pl-4">
              <div className="text-sm text-gray-500 mb-2">回复列表 ({comment.replies.length})</div>
              {comment.replies.map((reply, replyIndex) => (
                <div key={reply.id} className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.author?.nickname || '匿名用户'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(reply.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="text-sm text-gray-700 mb-2"
                    dangerouslySetInnerHTML={{ __html: reply.content }}
                  />
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <button className="hover:text-blue-600">支持 ({reply.likeCount || 0})</button>
                    <button className="hover:text-red-600">反对 ({reply.dislikeCount || 0})</button>
                    <button className="hover:text-orange-600">举报</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 回复编辑器 */}
          {showReplyEditor && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">回复 @{comment.author?.nickname || '匿名用户'}</h4>
                <OptimizedWangEditor
                  content={replyContent}
                  onChange={setReplyContent}
                  placeholder="请输入回复内容..."
                  height={150}
                  maxImageSize={5 * 1024 * 1024}
                  maxVideoSize={20 * 1024 * 1024}
                  maxImageNumber={3}
                  maxVideoNumber={1}
                  uploadUrl="/api/common/upload"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button onClick={() => setShowReplyEditor(false)}>
                  取消
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleReplySubmit}
                  loading={replyLoading}
                  disabled={!replyContent.trim()}
                >
                  发表回复
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 举报弹窗 */}
      <Modal
        title="举报评论"
        open={reportModalVisible}
        onOk={handleReport}
        onCancel={() => {
          setReportModalVisible(false);
          setReportContent('');
        }}
        okText="提交举报"
        cancelText="取消"
      >
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">请说明举报原因：</p>
          <Input.TextArea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder="请输入举报原因..."
            rows={4}
            maxLength={500}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ForumCommentItem; 