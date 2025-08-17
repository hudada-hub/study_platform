'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Modal, Input, Pagination } from 'antd';
import { FiEye, FiMessageSquare, FiStar, FiClock, FiUser, FiArrowLeft, FiThumbsUp, FiCornerUpLeft, FiPlus, FiMail, FiArrowUp, FiList, FiFlag } from 'react-icons/fi';
import { request } from '@/utils/request';
import { ForumPost, ForumComment } from '@/types/forum';
import dynamic from 'next/dynamic';

const OptimizedWangEditor = dynamic(() => import('@/app/components/template/OptimizedWangEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-32 bg-gray-100 rounded animate-pulse flex items-center justify-center">加载编辑器中...</div>
});
import { isAuthenticated } from '@/utils/client-auth';
import ForumCommentItem from '@/components/forum/ForumCommentItem';
import ForumBreadcrumb from '@/components/forum/ForumBreadcrumb';
import { moderateText } from '@/services/contentModeration';
import Swal from 'sweetalert2';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showCommentEditor, setShowCommentEditor] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportContent, setReportContent] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (postId) {
      fetchPostDetail();
      fetchComments();
      checkLoginStatus();
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, currentPage, pageSize]);

  // 当登录状态或帖子数据变化时，更新收藏状态
  useEffect(() => {
    if (isLoggedIn && post) {
      setIsFavorited(post.isFavorited || false);
    } else if (!isLoggedIn) {
      setIsFavorited(false);
    }
  }, [isLoggedIn, post]);

  const checkLoginStatus = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
  };

  const checkFavoriteStatus = async () => {
    if (!isLoggedIn) return;
    
    // 从帖子详情中获取收藏状态，无需单独调用接口
    if (post?.isFavorited !== undefined) {
      setIsFavorited(post.isFavorited);
    }
  };

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能进行收藏操作',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    if (favoriteLoading) return;
    
    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        // 取消收藏
        await request(`/forum/posts/${postId}/favorite`, {
          method: 'DELETE',
        });
        setIsFavorited(false);
        Swal.fire({
          icon: 'success',
          title: '取消收藏成功',
          text: '已取消收藏该帖子',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        // 添加收藏
        await request(`/forum/posts/${postId}/favorite`, {
          method: 'POST',
        });
        setIsFavorited(true);
        Swal.fire({
          icon: 'success',
          title: '收藏成功',
          text: '已成功收藏该帖子',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } catch (error: any) {
      console.error('收藏操作失败:', error);
      
      // 处理特定的错误情况
      if (error.message === '已经收藏过该帖子') {
        // 如果已经收藏过，更新状态为已收藏
        setIsFavorited(true);
        Swal.fire({
          icon: 'info',
          title: '提示',
          text: '您已经收藏过该帖子',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '收藏操作失败',
          text: error.message || '请稍后重试',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      const response = await request(`/forum/posts/${postId}`, {
        method: 'GET',
      });
      const postData = response.data as ForumPost;
      setPost(postData);
      
      // 设置收藏状态
      if (isLoggedIn && postData.isFavorited !== undefined) {
        setIsFavorited(postData.isFavorited);
      }
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      Swal.fire({
        icon: 'error',
        title: '获取帖子详情失败',
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

  const fetchComments = async () => {
    try {
      const response = await request(`/forum/posts/${postId}/comments?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
      });
      const data = response.data as {
        list: ForumComment[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
      setComments(data.list || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    // 滚动到评论区域
    setTimeout(() => {
      const commentSection = document.getElementById('comment-section');
      if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBack = () => {
    router.back();
  };

  const handleComment = async () => {
    if (!commentContent.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '请输入评论内容',
        text: '请填写评论内容后再提交',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

    // 进行内容审核
    const moderationResult = await moderateText(commentContent);
    
    if (!moderationResult.success) {
              Swal.fire({
          icon: 'error',
          title: '审核失败',
          text: '内容审核服务异常，请稍后重试',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      return;
    }
    
    if (!moderationResult.isSafe) {
              Swal.fire({
          icon: 'warning',
          title: '内容审核未通过',
          text: moderationResult.message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      return;
    }

    try {
      setCommentLoading(true);
      await request(`/forum/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: commentContent.trim(),
        }),
      });
      
      Swal.fire({
        icon: 'success',
        title: '评论成功',
        text: '您的评论已成功发表',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      setCommentContent('');
      // 刷新当前页评论，不跳转页面
      fetchComments();
    } catch (error) {
      console.error('评论失败:', error);
      Swal.fire({
        icon: 'error',
        title: '评论失败',
        text: '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplyToComment = (commentId: number) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能进行回复操作',
      });
      return;
    }
    setShowCommentEditor(true);
    // 滚动到底部并聚焦编辑器
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // 聚焦到编辑器
      const editorElement = document.querySelector('.w-e-text-container');
      if (editorElement) {
        (editorElement as HTMLElement).focus();
      }
    }, 300);
  };

  const handleSupportComment = (commentId: number) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能进行支持操作',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: '支持成功',
      text: '您的支持已记录',
    });
  };

  const handleOpposeComment = (commentId: number) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能进行反对操作',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: '反对成功',
      text: '您的反对已记录',
    });
  };

  const handleLogin = () => {
    // 跳转到登录页面
    router.push('/login');
  };

  const handleRegister = () => {
    // 跳转到注册页面
    router.push('/register');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    router.push(`/forum/sections/${post?.sectionId}`);
  };

  const handleReportPost = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: '请先登录',
        text: '登录后才能进行举报操作',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
      return;
    }

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
      await request(`/forum/posts/${postId}/report`, {
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
    } catch (error:any) {
      console.error('举报失败:', error);
              Swal.fire({
          icon: 'error',
          title: '举报失败',
          text: error.message,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
    }
  };

  const handleQuickReply = () => {
    setShowCommentEditor(true);
    // 滚动到底部并聚焦编辑器
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // 等待滚动完成后聚焦编辑器
      setTimeout(() => {
        const editorElement = document.querySelector('.w-e-text-container');
        if (editorElement) {
          (editorElement as HTMLElement).focus();
        }
      }, 500);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className=" mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-screen">
            <div className="text-center text-gray-500">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className=" mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center text-gray-500">帖子不存在</div>
          </div>
        </div>
      </div>
    );
  }

  // 构建面包屑导航
  const breadcrumbItems = [
    {
      label: '板块列表',
      href: '/forum/sections'
    },
    {
      label: post.section?.name || '未知板块',
      href: `/forum/sections/${post.sectionId}`
    },
    {
      label: post.title
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 py-8">
        {/* 面包屑导航 */}
        <ForumBreadcrumb items={breadcrumbItems} />
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex">
            {/* 左侧用户信息栏 */}
            <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
              <div className="text-center">
                {/* 用户名 */}
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {post.author?.nickname || '匿名用户'}
                </div>
                
                {/* 用户头像 */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {post.author?.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.nickname || '用户头像'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                {/* 用户称号 */}
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm text-gray-600">
                    {post.author?.nickname || '匿名用户'}
                  </span>
                  <div className="flex items-center ml-1">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                
                {/* 统计数据 - 水平排列 */}
                <div className="flex justify-between items-center mb-3 px-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {post.author?.postCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">主题</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {post.author?.commentCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">帖子</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {post.author?.viewCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">浏览</div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  注册时间 {post.author?.createdAt ? new Date(post.author.createdAt).toLocaleDateString('zh-CN') : '未知'}
                </div>
                
               
              </div>
            </div>

            {/* 右侧帖子内容区域 */}
            <div className="flex-1 p-4">
              {/* 帖子头部 */}
              <div className="flex items-center justify-between mb-4">
                <Button 
                  icon={<FiArrowLeft />} 
                  onClick={handleBack}
                  className="flex items-center"
                >
                  返回
                </Button>
                <div className="flex items-center space-x-3">
                  <Button 
                    icon={<FiStar />}
                    onClick={handleFavorite}
                    loading={favoriteLoading}
                    type={isFavorited ? 'primary' : 'default'}
                    className={isFavorited ? 'bg-yellow-500 border-yellow-500 hover:bg-yellow-600' : ''}
                  >
                    {isFavorited ? '已收藏' : '收藏'}
                  </Button>
                  <Button 
                    icon={<FiCornerUpLeft />} 
                    onClick={() => {
          
                      handleQuickReply();
                    
                    }}
                  >
                    回复
                  </Button>
                  <Button 
                    icon={<FiFlag />}
                    onClick={() => setReportModalVisible(true)}
                    danger
                  >
                    举报
                  </Button>
                </div>
              </div>

              {/* 帖子标题和发布信息 */}
              <div className="mb-6">
                <h1 className="text-2xl font-medium text-gray-900 mb-2">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>发表于 {new Date(post.createdAt).toLocaleString('zh-CN')}</span>
                    <span>只看该作者</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiEye className="w-4 h-4" />
                      <span>{post.viewCount} 浏览</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiMessageSquare className="w-4 h-4" />
                      <span>{total} 回复</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiStar className="w-4 h-4" />
                      <span>{post.likeCount} 点赞</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 帖子内容 */}
              <div className="prose max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* 帖子状态标签 */}
              <div className="flex items-center space-x-2">
                {post.isTop && (
                  <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">置顶</span>
                )}
                {post.isEssence && (
                  <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">精华</span>
                )}
                {post.isHot && (
                  <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded">热门</span>
                )}
               
              </div>
            </div>
          </div>
        </div>

        {/* 回复编辑器或登录提示 */}
        

        {/* 回复列表 */}
        <div id="comment-section" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              回复列表 ({total})
            </h3>
          </div>
          
          {comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center text-gray-500">
                暂无回复，快来抢沙发吧！
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <ForumCommentItem
                    key={comment.id}
                    comment={comment}
                    index={(currentPage - 1) * pageSize + index}
                    onReply={handleReplyToComment}
                    onSupport={handleSupportComment}
                    onOppose={handleOpposeComment}
                  />
                ))}
              </div>
              
              {/* 分页组件 */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    pageSizeOptions={['5', '10', '20', '50']}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {showCommentEditor && (
          <div className="bg-white rounded-lg shadow-sm mt-6">
            <div className="p-6">
              {isLoggedIn ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">发表回复</h3>
                  <OptimizedWangEditor
                    content={commentContent}
                    onChange={setCommentContent}
                    placeholder="请输入回复内容..."
                    height={200}
                    maxImageSize={10 * 1024 * 1024}
                    maxVideoSize={50 * 1024 * 1024}
                    maxImageNumber={5}
                    maxVideoNumber={2}
                    uploadUrl="/api/common/upload"
                  />
                  <div className="flex justify-end space-x-3 mt-4">
                    <Button onClick={() => setShowCommentEditor(false)}>
                      取消
                    </Button>
                    <Button 
                      type="primary" 
                      onClick={handleComment}
                      loading={commentLoading}
                      disabled={!commentContent.trim()}
                    >
                      发表回复
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-600 mb-4">
                    您需要登录后才可以回帖
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={handleLogin}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      登录
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      onClick={handleRegister}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      立即注册
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 右侧固定按钮组 */}
        <div className="fixed right-8 bottom-8 z-50">
          <div className="flex flex-col space-y-3">
            {/* 快速回复按钮 */}
            <button
              onClick={handleQuickReply}
              className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
              title="快速回复"
            >
              <FiMessageSquare className="w-5 h-5" />
            </button>

            {/* 回到顶部按钮 */}
            <button
              onClick={handleScrollToTop}
              className="w-12 h-12 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
              title="回到顶部"
            >
              <FiArrowUp className="w-5 h-5" />
            </button>

            {/* 返回列表按钮 */}
            <button
              onClick={handleBackToList}
              className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
              title="返回列表"
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 举报弹窗 */}
        <Modal
          title="举报帖子"
          open={reportModalVisible}
          onOk={handleReportPost}
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
    </div>
  );
} 