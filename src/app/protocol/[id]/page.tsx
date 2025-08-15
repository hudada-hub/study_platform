'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { request } from '@/utils/request';
import { EyeIcon, ClockIcon, ArrowLeftIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  category:string;
  
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  // 获取文章详情
  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await request<Article>(`/articles/${params.id}`);
      if (response.code === 0 && response.data) {
        setArticle(response.data);
      }
    } catch (error) {
      console.error('获取文章详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 w-[1280px] mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            文章不存在或已被删除
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-[1280px] mx-auto px-4 py-8">
     

        <article className="bg-white rounded-lg  overflow-hidden">
          {/* 文章头部 */}
      
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
             
            </h1>
            <p> <span className='text-xl'>  更新时间：{dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm')}</span></p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
           
              
       
            
              
           
             
      
            

          
      

            

            {/* 文章内容 */}
            <div className="prose prose-lg text-zinc-900 max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
         
          </div>
        </article>

      </div>
    </div>
  );
} 