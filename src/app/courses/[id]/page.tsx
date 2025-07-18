'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { FiClock, FiStar, FiUsers, FiBook, FiLock, FiCreditCard, FiHeart, FiThumbsUp } from 'react-icons/fi';

import Swal from 'sweetalert2';
import { CosVideoWatermark } from '@/components/common/CosVideoWatermark';
import { useParams, useRouter } from 'next/navigation';
import { getUserAuth } from '@/utils/client-auth';
import { CommentSection } from './CommentSection';
import { RatingForm } from './components/RatingForm';
import Link from 'antd/es/typography/Link';

interface CourseDetail {
  id: number;
  title: string;
  coverUrl: string;
  summary: string;
  description: string;
  instructor: string;
  viewCount: number;
  studentCount: number;
  level: string;
  totalDuration: number;
  ratingScore: number;
  tags: string[];
  targetAudience: string;
  courseGoals: string;
  chapters: ChapterDetail[];
  isLiked?: boolean;
  isFavorited?: boolean;
  categoryName?: string; // 新增：课程分类名称
  watermarkType: 'TEXT' | 'IMAGE';
  watermarkContent: string;
  watermarkPosition: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER';
}

interface ChapterDetail {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  points: number;
  duration: number | null;
  children: ChapterDetail[];
}

interface LikeResponse {
  liked: boolean;
}

interface FavoriteResponse {
  favorited: boolean;
}

// 未登录提示组件
const LoginRequired = () => {
  const router = useRouter();
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur flex flex-col items-center justify-center text-center z-10">
      <FiLock className="text-4xl text-orange-500 mb-4" />
      <h3 className="text-xl mb-2">本门课程为收费课程</h3>
      <p className="text-gray-400 mb-6">您需要登录后才能观看</p>
      <button
        onClick={() => router.push('/login')}
        className="px-8 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
      >
        立即登录
      </button>
    </div>
  );
};

// 支付提示组件
const PaymentRequired = ({ points, onPay }: { points: number; onPay: () => void }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur flex flex-col items-center justify-center text-center z-10">
      <FiCreditCard className="text-4xl text-orange-500 mb-4" />
      <h3 className="text-xl mb-2">本节课程需要支付积分</h3>
      <p className="text-gray-400 mb-2">需要支付 {points} 积分才能观看</p>
      <p className="text-gray-400 mb-6">*支付后可永久观看</p>
      <button
        onClick={onPay}
        className="px-8 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
      >
        立即支付 {points} 积分
      </button>
    </div>
  );
};

// 课程章节组件
const ChapterList = ({ 
  chapters, 
  selectedChapter, 
  onChapterClick 
}: { 
  chapters: ChapterDetail[],
  selectedChapter: ChapterDetail | null,
  onChapterClick: (chapter: ChapterDetail) => void
}) => {
  return (
    <div className="h-full overflow-y-auto">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <FiBook className="text-lg" />
            <span className="font-medium">{chapter.title}</span>
          </div>
          <div className="space-y-1">
            {chapter.children?.map((subChapter) => (
              <div
                key={subChapter.id}
                className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors
                  ${selectedChapter?.id === subChapter.id 
                    ? 'bg-orange-50 text-orange-500' 
                    : 'hover:bg-gray-50'}`}
                onClick={() => onChapterClick(subChapter)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{subChapter.title}</span>
                  {subChapter.duration && (
                    <span className="text-xs text-gray-400">{Math.floor(subChapter.duration / 60)}分钟</span>
                  )}
                </div>
                {subChapter.points > 0 && (
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-500 rounded">
                    {subChapter.points}积分
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// 面包屑组件
const Breadcrumb = ({ category, courseTitle }: { category: string; courseTitle: string }) => (
  <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
    <Link href="/courses">学习课程</Link>
    <span className="mx-1">&gt;</span>
    <span>{category}</span>
    <span className="mx-1">&gt;</span>
    <span className="text-black font-medium">{courseTitle}</span>
  </nav>
);


const CoursePage = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('introduction'); // 新增：当前激活的选项卡

  // 检查登录状态
  useEffect(() => {
    const {token} = getUserAuth();
    setIsLoggedIn(!!token);
  }, []);

  // 检查购买状态
  useEffect(() => {
    if (selectedChapter && isLoggedIn) {
      checkPurchaseStatus();
    }
  }, [selectedChapter, isLoggedIn]);

  // 检查是否已购买
  const checkPurchaseStatus = async () => {
    if (!selectedChapter) return;
    try {
      const orderRes = await request<{ hasPurchased: boolean }>(`/courses/${params.id}/chapters/${selectedChapter.id}/order`, {
        method: 'GET'
      });
      console.log(orderRes);
      setHasPurchased(orderRes.code === 0 && orderRes.data!=null);
    } catch (error) {
      console.error('检查购买状态失败:', error);
      setHasPurchased(false);
    }
  };

  // 处理支付
  const handlePay = async () => {
    if (!selectedChapter) return;
    try {
      const createOrderRes = await request(`/courses/${params.id}/chapters/${selectedChapter.id}/order`, {
        method: 'POST'
      });

      if (createOrderRes.code === 0) {
        setHasPurchased(true);
      } else {
        throw new Error(createOrderRes.message);
      }
    } catch (error: any) {
      console.error('支付失败:', error);
    }
  };

  // 处理点赞
  const handleLike = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: '请先登录',
        text: '登录后才能点赞课程',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '去登录',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      const res = await request<LikeResponse>(`/courses/${params.id}/like`, {
        method: 'POST'
      });

      if (res.code === 0 && res.data) {
        setIsLiked(res.data.liked);
        Swal.fire({
          title: res.data.liked ? '点赞成功' : '已取消点赞',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('处理点赞失败:', error);
    }
  };

  // 处理收藏
  const handleFavorite = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: '请先登录',
        text: '登录后才能收藏课程',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '去登录',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      const res = await request<FavoriteResponse>(`/courses/${params.id}/favorite`, {
        method: 'POST'
      });

      if (res.code === 0 && res.data) {
        setIsFavorited(res.data.favorited);
        Swal.fire({
          title: res.data.favorited ? '收藏成功' : '已取消收藏',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('处理收藏失败:', error);
    }
  };

  // 获取课程详情时同时获取点赞和收藏状态
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await request<CourseDetail>(`/courses/${params.id}`);
        if (response.code === 0 && response.data) {
        setCourse(response.data);
          setIsLiked(response.data.isLiked || false);
          setIsFavorited(response.data.isFavorited || false);
        }
      } catch (error) {
        console.error('获取课程详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [params.id]);

  // 处理章节点击
  const handleChapterClick = async (chapter: ChapterDetail) => {
    try {
      const orderRes = await request(`/courses/${params.id}/chapters/${chapter.id}/order`, {
        method: 'GET'
      });

      if (orderRes.code === 0 ) {
        setSelectedChapter(chapter);
        return;
      }

      if (chapter.points > 0) {
        // const result = await Swal.fire({
        //   title: '需要积分',
        //   text: `观看本视频需要 ${chapter.points} 积分，是否确认观看？`,
        //   icon: 'warning',
        //   showCancelButton: true,
        //   confirmButtonText: '确认观看',
        //   cancelButtonText: '取消'
        // });

        // if (result.isConfirmed) {
        //   try {
        //     const createOrderRes = await request(`/courses/${params.id}/chapters/${chapter.id}/order`, {
        //       method: 'POST'
        //     });

        //     if (createOrderRes.code === 0) {
        //       setSelectedChapter(chapter);
        //       Swal.fire({
        //         title: '购买成功',
        //         text: '已成功使用积分购买本章节',
        //         icon: 'success',
        //         timer: 1500,
        //         showConfirmButton: false
        //       });
        //     } else {
        //       throw new Error(createOrderRes.message);
        //     }
        //   } catch (error: any) {
        //     Swal.fire({
        //       title: '购买失败',
        //       text: error.message || '积分不足或发生其他错误',
        //       icon: 'error'
        //     });
        //   }
        // }
      } else {
        setSelectedChapter(chapter);
      }
    } catch (error: any) {
      console.error('处理章节点击失败:', error);
      Swal.fire({
        title: '操作失败',
        text: error.message || '请稍后重试',
        icon: 'error'
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">课程不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 container mx-auto px-2 sm:px-6 md:px-8">
      {/* 课程头部信息 */}
      <div className="pt-4 sm:pt-6">
        {course && (
          <Breadcrumb category={course.categoryName! } courseTitle={course.title} />
        )}
      </div>
      {/* 主要内容区域 */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* 左侧：视频播放和选项卡内容 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg overflow-hidden aspect-video mb-4 sm:mb-6 relative shadow-sm">
            {!isLoggedIn && <LoginRequired />}
            {isLoggedIn && selectedChapter && selectedChapter.points > 0 && !hasPurchased && (
              <PaymentRequired points={selectedChapter.points} onPay={handlePay} />
            )}
              {selectedChapter?.videoUrl ? (
                  <CosVideoWatermark
                  path={selectedChapter.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                />
              ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-950  text-zinc-50">
                请选择要播放的视频
                </div>
              )}


            </div>

            <div>
            <div className="p-4 sm:p-6 bg-white rounded-lg mb-4 sm:mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                <div className="flex-1">
                  <h1 className="text-2xl mb-2 font-medium text-gray-900">{course.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{Math.floor(course.totalDuration / 60)}分钟</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers />
                      <span>{course.studentCount}人学习</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar />
                      <span>{course.ratingScore}分</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors border border-gray-200 bg-white text-sm ${
                      isLiked ? 'text-orange-500 border-orange-200 bg-orange-50' : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    <FiThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? '已点赞' : '点赞'}
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors border border-gray-200 bg-white text-sm ${
                      isFavorited ? 'text-orange-500 border-orange-200 bg-orange-50' : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? '已收藏' : '收藏'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 选项卡导航 */}
          <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('introduction')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'introduction'
                  ? 'text-orange-500'
                  : 'text-gray-400 '
              }`}
            >
              课程介绍
              {activeTab === 'introduction' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('rating')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'rating'
                  ? 'text-orange-500'
                  : 'text-gray-400 '
              }`}
            >
              课程评价
              {activeTab === 'rating' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'comments'
                  ? 'text-orange-500'
                  : 'text-gray-400 '
              }`}
            >
              课程评论
              {activeTab === 'comments' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-6 py-3 text-sm transition-colors relative ${
                activeTab === 'catalog'
                  ? 'text-orange-500'
                  : 'text-gray-400 '
              }`}
            >
              课程目录
              {activeTab === 'catalog' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></div>
              )}
            </button>
          </div>

          {/* 选项卡内容 */}
          <div className="mb-4 sm:mb-6">
            {activeTab === 'introduction' && (
              <div className="bg-white rounded p-4 sm:p-6 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-lg mb-3">课程简介</h3>
                  <p className="text-gray-400 text-sm">{course.description}</p>
                </div> 
                
                <div>
                  <h3 className="text-lg mb-3">适合人群</h3>
                  <p className="text-gray-400 text-sm">{course.targetAudience}</p>
                </div>
                <div>
                  <h3 className="text-lg mb-3">课程目标</h3>
                  <p className="text-gray-400 text-sm">{course.courseGoals}</p>
                </div>
                <div>
                  <h3 className="text-lg mb-3">讲师介绍</h3>
                  <p className="text-gray-400 text-sm">{course.instructor}</p>
                </div>
              </div>
            )}
            {activeTab === 'rating' && isLoggedIn && (
              <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
                <RatingForm courseId={parseInt(params.id as string)} />
              </div>
            )}
            {activeTab === 'comments' && (
              <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
                <CommentSection courseId={parseInt(params.id as string)} />
              </div>
            )}
            {activeTab === 'catalog' && (
              <div className="bg-white rounded p-4 sm:p-6 shadow-sm">
                <ChapterList
                  chapters={course.chapters}
                  selectedChapter={selectedChapter}
                  onChapterClick={handleChapterClick}
                />
              </div>
            )}
          </div>
        </div>
        {/* 右侧：章节列表，移动端隐藏 */}
        <div className="hidden md:block w-80 bg-white p-4 self-start sticky top-6 rounded shadow-sm">
          <h2 className="text-lg mb-4 flex items-center gap-2 text-gray-900">
            <span>课程目录</span>
            <span className="text-xs text-gray-400">({course.chapters.length}章)</span>
          </h2>
          <ChapterList
            chapters={course.chapters}
            selectedChapter={selectedChapter}
            onChapterClick={handleChapterClick}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 