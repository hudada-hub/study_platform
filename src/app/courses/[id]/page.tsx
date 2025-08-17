'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { FiClock, FiStar, FiUsers, FiBook, FiLock, FiCreditCard, FiHeart, FiThumbsUp } from 'react-icons/fi';
import { CosImage } from '@/components/common/CosImage';

import Swal from 'sweetalert2';
import { CosVideoWithProgress } from '@/components/common/CosVideoWithProgress';
import { useParams, useRouter } from 'next/navigation';
import { getUserAuth } from '@/utils/client-auth';
import { CommentSection } from './CommentSection';
import { RatingForm } from './components/RatingForm';
import Link from 'next/link';
import { LearningProgress } from '@/components/common/LearningProgress';
import { ChapterList } from './components/ChapterList';
import CourseDirectory from './components/CourseDirectory';
import SideTabs from './components/SideTabs';

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
  totalChapters: number; // 新增：总章节数
  learnedChapters: number; // 新增：已学习章节数
  ratingScore: number;
  tags: string[];
  targetAudience: string;
  courseGoals: string;
  chapters: ChapterDetail[];
  isLiked?: boolean;
  isFavorited?: boolean;
  categoryName?: string; // 新增：课程分类名称
  directionName?: string; // 新增：课程方向名称
  averageRatings?: { // 新增：评价平均分
    descriptionRating: number;
    valueRating: number;
    teachingRating: number;
  };
  isFree?: boolean; // 新增：是否免费
  requiredPoints?: number; // 新增：所需积分
  episodeCount?: number; // 新增：总章节数
  oneTimePayment?: boolean; // 新增：是否支持一次性支付
  oneTimePoint?: number; // 新增：一次性支付积分
  watermarkType: 'TEXT' | 'IMAGE';
  watermarkContent: string;
  watermarkPosition: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER';
  courseware?: { name: string; url: string }[]; // 新增：课件列表
}

interface ChapterDetail {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  points: number;
  duration: number | null;
  children: ChapterDetail[];
  progress?: number; // 新增：学习进度
  coverUrl: string | null;
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
      <FiLock className="text-4xl text-cyan-500 mb-4" />
      <h3 className="text-xl mb-2 text-white">本门课程为收费课程</h3>
      <p className="text-gray-400 mb-6">您需要登录后才能观看</p>
      <button
        onClick={() => router.push('/login')}
        className="px-8 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
      >
        立即登录
      </button>
    </div>
  );
};

// 支付提示组件
const PaymentRequired = ({ points, onPay, coverUrl }: { points: number; onPay: () => void; coverUrl: string }) => {
  const isFree = points === 0;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
      {/* 背景图片 */}
      <div className="absolute inset-0">
      
  
        <CosImage
          path={coverUrl}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black/60 "></div>
      </div>

      {/* 内容 */}
      <div className="relative z-10">
       
        <h3 className="text-xl mb-2 text-white">
          {isFree ? '本节课程免费观看' : '本节课程需要支付积分'}
        </h3>
        <p className="text-gray-200 mb-2">
          {isFree ? '无需支付积分，可直接观看' : `需要支付 ${points} 积分才能观看`}
        </p>
        <p className="text-gray-300 mb-6">
          {isFree ? '*免费课程可永久观看' : '*支付后可永久观看'}
        </p>
        <button
          onClick={onPay}
          className="px-8 cursor-pointer py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
        >
          {isFree ? '免费观看' : `立即支付 ${points} 积分`}
        </button>
      </div>
    </div>
  );
};

// 一次性支付课程提示组件
const OneTimePaymentRequired = ({ oneTimePoint, onPay, coverUrl }: { oneTimePoint: number; onPay: () => void; coverUrl: string }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <CosImage
          path={coverUrl}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black/60 "></div>
      </div>

      {/* 内容 */}
      <div className="relative z-10">
        <FiCreditCard className="text-4xl text-cyan-500 mb-4" />
        <h3 className="text-xl mb-2 text-white">
          本门课程为收费课程，您购买后才能观看
        </h3>
        <p className="text-gray-200 mb-2">
          价格 {oneTimePoint} 积分
        </p>
        <p className="text-gray-300 mb-6">
          *一次性购买整个课程，支付后可永久观看所有章节
        </p>
        <button
          onClick={onPay}
          className="px-8 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
        >
          立即购买 {oneTimePoint} 积分
        </button>
      </div>
    </div>
  );
};

// 面包屑组件
const Breadcrumb = ({ category, courseTitle }: { category: string; courseTitle: string }) => (
  <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
    <Link href="/courses" className="text-gray-500 hover:text-gray-700">学习课程</Link>
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
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState(false); // 新增：是否已购买整个课程
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog'); // 默认显示课程目录tab
  const [activeSideTab, setActiveSideTab] = useState<'directory' | 'file'>('directory'); // 新增：当前激活的选项卡
  const [chapterProgress, setChapterProgress] = useState<{ [key: number]: number }>({}); // 新增：章节进度状态
  const [userId, setUserId] = useState<number | null>(null);
  const [chapterVideoUrl, setChapterVideoUrl] = useState<string | null>(null);
  const [selectedChapterCoverUrl, setSelectedChapterCoverUrl] = useState<string | null>(null);

  // 检查登录状态
  useEffect(() => {
    const {token, userInfo} = getUserAuth();
    setIsLoggedIn(!!token);
    setUserId(userInfo?.id || null);
  }, []);

  // 检查购买状态和学习进度
  useEffect(() => {
    if (selectedChapter && isLoggedIn) {
      checkPurchaseStatus();
      fetchChapterProgress();
    }
  }, [selectedChapter, isLoggedIn]);

  // 检查是否已购买整个课程
  const checkCoursePurchaseStatus = async (courseData?: CourseDetail) => {
    const courseToCheck = courseData || course;
    console.log('33333333333', courseToCheck, isLoggedIn);
    if (!isLoggedIn || !courseToCheck) return;

    console.log('44444');
    try {
      // 检查是否有整个课程的订单记录
      const orderRes = await request<{ hasPurchased: boolean }>(`/courses/${params.id}/course-order`, {
        method: 'GET'
      });
      console.log(orderRes, 'orderRes');
      if (orderRes.code === 0 && orderRes.data) {
        setHasPurchasedCourse(orderRes.data.hasPurchased);
      } else {
        setHasPurchasedCourse(false);
      }
    } catch (error) {
      console.error('检查课程购买状态失败:', error);
      setHasPurchasedCourse(false);
    }
  };

  // 检查是否已购买
  const checkPurchaseStatus = async () => {
    if (!selectedChapter) return;
    try {
      const orderRes = await request<{ hasPurchased: boolean; videoUrl?: string }>(`/courses/${params.id}/chapters/${selectedChapter.id}/order`, {
        method: 'GET'
      });
   
      if (orderRes.code === 0 && orderRes.data ) {
        setHasPurchased(true);
        setChapterVideoUrl(orderRes.data.videoUrl || null);
      } else {
        setHasPurchased(false);
        setChapterVideoUrl(null);
        // 如果没有购买记录且章节需要积分，显示支付提示
        if (selectedChapter.points > 0) {
          console.log(`本节课程需要支付 ${selectedChapter.points} 积分才能观看`);
        }
      }
    } catch (error) {
      console.error('检查购买状态失败:', error);
      setHasPurchased(false);
      setChapterVideoUrl(null);
    }
  };

  // 获取章节学习进度
  const fetchChapterProgress = async () => {
    if (!selectedChapter) return;
    try {
      const progressRes = await request<{ progress: number; hasPurchased: boolean }>(`/courses/${params.id}/chapters/${selectedChapter.id}/progress`, {
        method: 'GET'
      });
      
      if (progressRes.code === 0 && progressRes.data) {
        setChapterProgress(prev => ({
          ...prev,
          [selectedChapter.id]: progressRes.data.progress
        }));
      }
    } catch (error) {
      console.error('获取学习进度失败:', error);
    }
  };

  // 处理一次性支付课程购买
  const handleCoursePay = async () => {
    if (!course) return;
    try {
      const createOrderRes = await request<{ success: boolean }>(`/courses/${params.id}/course-order`, {
        method: 'POST'
      });

      if (createOrderRes.code === 0) {
        setHasPurchasedCourse(true);
        
        // 支付成功后刷新用户信息，更新积分显示
        if (typeof window !== 'undefined') {
          // 触发全局用户信息刷新
          window.dispatchEvent(new CustomEvent('refreshUserInfo'));
        }
        
        Swal.fire({
          icon: 'success',
          title: '购买成功',
          text: '您已成功购买整个课程，现在可以观看所有章节',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          position: 'top-end',
          toast: true
        });
      } else {
        throw new Error(createOrderRes.message);
      }
    } catch (error: any) {
      console.error('购买失败:', error);
      Swal.fire({
        icon: 'error',
        title: '购买失败',
        text: error.message || '请稍后重试',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        position: 'top-end',
        toast: true
      });
    }
  };

  // 处理支付
  const handlePay = async () => {
    if (!selectedChapter) return;
    try {
      const createOrderRes = await request<{ videoUrl: string }>(`/courses/${params.id}/chapters/${selectedChapter.id}/order`, {
        method: 'POST'
      });

      if (createOrderRes.code === 0) {
        setHasPurchased(true);
        setChapterVideoUrl(createOrderRes.data?.videoUrl || null);
        
        // 支付成功后刷新用户信息，更新积分显示
        if (typeof window !== 'undefined') {
          // 触发全局用户信息刷新
          window.dispatchEvent(new CustomEvent('refreshUserInfo'));
        }
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
          position: "top-end",
          title: res.data.liked ? '点赞成功' : '已取消点赞',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
          toast: true
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
          timer: 3000,
          showConfirmButton: false,
          timerProgressBar: true,
          toast: true
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
          console.log(course,'ddd',response.data)
      
          setIsLiked(response.data.isLiked || false);
          setIsFavorited(response.data.isFavorited || false);
      
          // 如果用户已登录，获取学习记录
          if (isLoggedIn) {
            try {
              // 获取用户在该课程的学习记录
              const learningResponse = await request<{ events: any[] }>(`/analytics/learning-events?courseId=${params.id}`);
              
              if (learningResponse.code === 0 && learningResponse.data?.events?.length > 0) {
                // 按时间倒序排序，获取最近学习的章节
                const lastEvent = learningResponse.data.events[0];
                const lastChapterId = lastEvent.chapterId;
                
                // 在课程章节中找到对应章节
                const findChapter = (chapters: ChapterDetail[]): ChapterDetail | null => {
                  for (const chapter of chapters) {
                    if (chapter.children) {
                      for (const subChapter of chapter.children) {
                        if (subChapter.id === lastChapterId) {
                          return subChapter;
                        }
                      }
                    }
                  }
                  return null;
                };

                const lastChapter = findChapter(response.data.chapters);
                if (lastChapter) {
                  setSelectedChapter(lastChapter);
                  return;
                }
              }
            } catch (error) {
              console.error('获取学习记录失败:', error);
            }
          }
          
          // 如果没有学习记录或获取失败，选择第一个大章节的第一个小章节
          const findFirstSubChapter = (chapters: ChapterDetail[]): ChapterDetail | null => {
            for (const chapter of chapters) {
              if (chapter.children && chapter.children.length > 0) {
                // 返回第一个大章节的第一个小章节
                return chapter.children[0];
              }
            }
            return null;
          };

          const firstChapter = findFirstSubChapter(response.data.chapters);
          if (firstChapter) {
            setSelectedChapter(firstChapter);
            // 立即检查购买状态
            setTimeout(() => {
              checkPurchaseStatus();
            }, 100);
          }
        
          // 检查整个课程的购买状态
          if (isLoggedIn) {
            checkCoursePurchaseStatus(response.data);
          }
        }
      } catch (error) {
        console.error('获取课程详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [params.id, isLoggedIn]);



  // 处理章节点击
  const handleChapterClick = async (chapter: ChapterDetail) => {
    console.log(chapter,'chapter')
    setSelectedChapter(chapter);
    setSelectedChapterCoverUrl(chapter.coverUrl || '');
    setChapterVideoUrl(null); // 重置视频URL
    
    // 如果是一次性支付课程且已购买，直接设置视频URL
    if (course?.oneTimePayment && course?.oneTimePoint && course.oneTimePoint > 0 && hasPurchasedCourse) {
      if (chapter.videoUrl) {
        setChapterVideoUrl(chapter.videoUrl);
        return;
      }
    }

    try {
      const orderRes = await request(`/courses/${params.id}/chapters/${chapter.id}/order`, {
        method: 'GET'
      });

      if (orderRes.code === 0 && orderRes.data) {
        setChapterVideoUrl((orderRes.data as any)?.videoUrl || null);
        return;
      }

      if (chapter.points > 0) {
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

  // 处理进度更新
  // 使用防抖来限制进度更新频率
  const [lastProgressUpdate, setLastProgressUpdate] = useState<number>(0);
  const PROGRESS_UPDATE_INTERVAL = 5000; // 5秒更新一次

  const handleProgressUpdate = async (progress: number) => {
    if (selectedChapter) {
      // 立即更新本地状态
      setChapterProgress(prev => ({
        ...prev,
        [selectedChapter.id]: progress
      }));
      
      // 检查是否需要更新后端（每5秒更新一次）
      const now = Date.now();
      if (userId && (now - lastProgressUpdate) >= PROGRESS_UPDATE_INTERVAL) {
        setLastProgressUpdate(now);
        
        try {
          await request(`/courses/${params.id}/chapters/${selectedChapter.id}/progress`, {
            method: 'POST',
            body: JSON.stringify({ progress })
          });
        } catch (error) {
          console.error('记录学习进度失败:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 container mx-auto px-2 sm:px-6 md:px-8">
        {/* 面包屑骨架 */}
        <div className="pt-4 sm:pt-6 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* 主要内容区域骨架 */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* 左侧：视频播放和选项卡内容 */}
          <div className="flex-1">
            <div className="flex gap-2 h-[600px]">
              {/* 视频播放区域骨架 */}
              <div className="bg-white flex-1 rounded-lg overflow-hidden aspect-video relative shadow-sm">
                <div className="w-full h-full bg-gray-200 animate-pulse"></div>
              </div>

              {/* 右侧目录骨架 */}
              <div className="hidden md:block w-80 bg-black h-full">
                <div className="w-full h-full bg-gray-800 animate-pulse"></div>
              </div>
            </div>

            {/* 课程信息卡片骨架 */}
            <div className="p-4 sm:p-6 bg-white rounded-lg mb-4 sm:mb-6 shadow-sm mt-4">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  {/* 课程标题骨架 */}
                  <div className="h-8 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
                  {/* 课程统计信息骨架 */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                {/* 操作按钮骨架 */}
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 选项卡导航骨架 */}
            <div className="flex border-b border-gray-200 mb-2 sm:mb-6">
              {['课程介绍', '课程评价', '课程评论', '课程目录'].map((tab, index) => (
                <div key={index} className="px-2 md:px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* 选项卡内容骨架 */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-white rounded p-4 sm:p-6 space-y-6 shadow-sm">
                {/* 课程简介骨架 */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                
                {/* 适合人群骨架 */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>

                {/* 课程目标骨架 */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                  </div>
                </div>

                {/* 讲师介绍骨架 */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="min-h-screen flex items-center justify-center">课程不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 container mx-auto px-2 sm:px-6 md:px-8">
      {/* 分页激活按钮边框cyan色 */}
      <style jsx global>{`
        .ant-pagination-item-active {
          border-color: #22d3ee !important;
        }
        .ant-pagination-item-active a {
          color: #06b6d4 !important;
        }
      `}</style>
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
          <div className="flex gap-2 h-[600px]">
            <div className="bg-white flex-1 rounded-lg overflow-hidden aspect-video  relative shadow-sm">
            {!isLoggedIn && <LoginRequired />}
            {isLoggedIn && course?.oneTimePayment && course?.oneTimePoint && course.oneTimePoint > 0 && !hasPurchasedCourse && (
              <OneTimePaymentRequired 
                oneTimePoint={course.oneTimePoint} 
                onPay={handleCoursePay} 
                coverUrl={course.coverUrl} 
              />
            )}
            {isLoggedIn && !course?.oneTimePayment && selectedChapter && !hasPurchased && (
              <PaymentRequired 
                points={selectedChapter.points} 
                onPay={handlePay} 
                coverUrl={selectedChapterCoverUrl || course.coverUrl} 
              />
            )}
             {chapterVideoUrl && selectedChapter && (hasPurchased || hasPurchasedCourse) ? (
                  <CosVideoWithProgress
                   path={chapterVideoUrl}
                    courseId={parseInt(params.id as string)}
                    chapterId={selectedChapter.id}
                    userId={userId || 0}
                    onProgressUpdate={handleProgressUpdate}
                    initialProgress={chapterProgress[selectedChapter.id] || 0}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full"
                  />
              ) : (
             <div 
               className="w-full h-full bg-center bg-cover bg-no-repeat flex items-center justify-center"
              style={{
                backgroundColor: `rgba(0, 0, 0, 1)`,
              }}
             >
            
               <div className="text-white text-center">
                 <h3 className="text-xl mb-2">{selectedChapter ? selectedChapter.title : '请选择要播放的视频'}</h3>
                 {selectedChapter && (
                   <p className="text-sm text-gray-300">
                     {selectedChapter.duration ? 
                       `时长：${selectedChapter.duration < 60 ? `${selectedChapter.duration}秒` : `${Math.ceil(selectedChapter.duration / 60)}分钟`}` 
                       : ''
                     }
                     {selectedChapter.points > 0 && !hasPurchased && !hasPurchasedCourse && (
                       <span className="block mt-2 text-cyan-400">
                         需要支付 {selectedChapter.points} 积分才能观看
                       </span>
                     )}
                   </p>
                 )}
               </div>
             </div>
              )}


            </div>

            <div className="hidden md:block w-80 bg-black h-full">
              <div className="flex h-full justify-end">
                {activeSideTab=='directory'&&<CourseDirectory
                  chapters={course.chapters?.map(chapter => ({
                    ...chapter,
                    children: chapter.children?.map(subChapter => ({
                      ...subChapter,
                      progress: chapterProgress[subChapter.id] || 0
                    }))
                  }))}
                  selectedSubChapterId={selectedChapter?.id}
                  onSubChapterClick={(subChapter) => {
                    // 根据subChapter.id找到完整的ChapterDetail对象
                    const findChapter = (chapters: ChapterDetail[]): ChapterDetail | null => {
                      for (const chapter of chapters) {
                        if (chapter.children) {
                          for (const sub of chapter.children) {
                            if (sub.id === subChapter.id) {
                              return sub;
                            }
                          }
                        }
                      }
                      return null;
                    };
                    
                    const fullChapter = findChapter(course.chapters);
                    if (fullChapter) {
                      handleChapterClick(fullChapter);
                    }
                  }}
                />}

                {activeSideTab=='file'&& <div className="h-full">
                  {/* 课件展示 */}
                  {course?.courseware && Array.isArray(course.courseware) && course.courseware.length > 0 ? (
                    <div className="p-4 bg-black text-white h-full">
                      <h3 className="text-base mb-2">课件下载</h3>
                      <ul className="space-y-2">
                        {course.courseware.map((item: any, idx: number) => (
                          <li key={idx} className="flex flex-col gap-1">
                            <span className="text-white">{item.name || `课件${idx + 1}`}</span>
                            <span className="text-gray-300 text-sm break-all">课件地址：{item.url}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-400 text-sm h-full w-full bg-black flex items-center justify-center">暂无课件</div>
                  )}
                </div>}
                <SideTabs active={activeSideTab} onChange={setActiveSideTab} />
              </div>
            </div>
          </div>

            <div>
            <div className="p-4 sm:p-6 bg-white rounded-lg mb-4 sm:mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                
                <div className="flex-1">
                  <h1 className="text-2xl mb-2 font-medium text-gray-900">{course.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FiBook />
                      <span>已学习{course.learnedChapters}章节/{course.totalChapters}章节</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers />
                      <span>{course.studentCount}人学习</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiStar />
                      <span>{course.ratingScore}分</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{course.categoryName}</span>
                    </div>
                    {!course.isFree && (
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="text-orange-500" />
                        <span className="text-orange-600">{course.requiredPoints}积分</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors border border-gray-200 bg-white text-sm ${
                      isLiked ? 'text-cyan-500 border-cyan-200 bg-cyan-50' : 'text-gray-500 hover:text-cyan-500'
                    }`}
                  >
                    <FiThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? '已点赞' : '点赞'}
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center gap-2 px-3 py-2 rounded transition-colors border border-gray-200 bg-white text-sm ${
                      isFavorited ? 'text-cyan-500 border-cyan-200 bg-cyan-50' : 'text-gray-500 hover:text-cyan-500'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? '已收藏' : '收藏'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 新的布局：左侧课程介绍，右侧其他tab内容 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧：课程介绍 */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded p-4 sm:p-6 space-y-6 shadow-sm">
                {/* 课程基本信息 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">课程等级：</span>
                      <span className="text-gray-900">{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">课程分类：</span>
                      <span className="text-gray-900">{course.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">课程方向：</span>
                      <span className="text-gray-900">{course.directionName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">总时长：</span>
                      <span className="text-gray-900">
                        {course.totalDuration < 60 ? `${course.totalDuration}秒` : `${Math.ceil(course.totalDuration / 60)}分钟`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">总章节数：</span>
                      <span className="text-gray-900">{course.episodeCount || course.totalChapters}章</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">浏览量：</span>
                      <span className="text-gray-900">{course.viewCount}次</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">学习人数：</span>
                      <span className="text-gray-900">{course.studentCount}人</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">课程费用：</span>
                      <span className={`${course.isFree ? 'text-green-600' : 'text-orange-600'}`}>
                        {course.isFree ? '免费' : `${course.requiredPoints}积分`}
                      </span>
                    </div>
                  </div>

                  {/* 课程评价 */}
                  {course.averageRatings && (
                    <div>
                      <h3 className="text-lg mb-3">课程评价</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">课程与描述相符：</span>
                          <span className="text-cyan-600 font-medium">{course.averageRatings.descriptionRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">课程内容价值：</span>
                          <span className="text-cyan-600 font-medium">{course.averageRatings.valueRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">老师讲解表达：</span>
                          <span className="text-cyan-600 font-medium">{course.averageRatings.teachingRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg mb-3">课程简介</h3>
                    <p className="text-gray-400 text-sm">{course.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：其他tab内容 */}
            <div className="lg:w-2/3">
              {/* 选项卡导航 */}
              <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('rating')}
                  className={`px-2 md:px-6 py-3 text-sm transition-colors relative ${
                    activeTab === 'rating'
                      ? 'text-cyan-500'
                      : 'text-gray-400 '
                  }`}
                >
                  课程评价
                  {activeTab === 'rating' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-2 md:px-6 py-3 text-sm transition-colors relative ${
                    activeTab === 'comments'
                      ? 'text-cyan-500'
                      : 'text-gray-400 '
                  }`}
                >
                  课程评论
                  {activeTab === 'comments' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`px-2 md:px-6 py-3 text-sm transition-colors relative ${
                    activeTab === 'catalog'
                      ? 'text-cyan-500'
                      : 'text-gray-400 '
                  }`}
                >
                  课程目录
                  {activeTab === 'catalog' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500"></div>
                  )}
                </button>
              </div>

              {/* 选项卡内容 */}
              <div className="mb-4 sm:mb-6">
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
                      chapterProgress={chapterProgress}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 