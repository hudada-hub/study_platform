import React from 'react';
import Link from 'next/link';

// 排行榜帖子数据类型
interface RankingPost {
  id: string;
  rank: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  hasImage: boolean;
  hasThumbsUp: boolean;
}

interface ForumRankingsProps {
  rankings: RankingPost[];
}

const ForumRankings: React.FC<ForumRankingsProps> = ({ rankings }) => {
  return (
    <div className="bg-white rounded-lg">
      {/* 标题栏 */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-1 h-4 bg-gray-300 mr-3"></div>
          <h1 className="text-lg text-gray-900">帖子排行</h1>
        </div>
        <Link href="/forum" className="text-sm text-gray-500 hover:text-gray-700">
          更多&gt;
        </Link>
      </div>

      {/* 排行榜列表 */}
      <div className="p-6">
        <div className="space-y-4">
          {rankings.map((post) => (
            <div key={post.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 transition-colors rounded-lg">
              {/* 左侧头像 */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center relative">
                  {post.hasThumbsUp ? (
                    <>
                      {/* 戴眼镜的头像 */}
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
                      </svg>
                      {/* 点赞图标 */}
                      <svg className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.76 20.2a2.76 2.76 0 002.74 2.74h13.5a2.76 2.76 0 002.74-2.74V6.5a2.76 2.76 0 00-2.74-2.74H5.5a2.76 2.76 0 00-2.74 2.74v13.7zM7.5 9.5h9v1.5h-9V9.5zm0 3h9v1.5h-9v-1.5z"/>
                      </svg>
                    </>
                  ) : (
                    /* 普通头像 */
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* 中间内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-500">[{post.category}]</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="text-sm text-gray-900 line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <div className="text-xs text-gray-500">
                  {post.author} ({post.date})
                </div>
              </div>

              {/* 右侧数据 */}
              <div className="flex-shrink-0 flex items-center space-x-4">
                {/* 浏览量 */}
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-xs text-gray-500">{post.views}</span>
                </div>

                {/* 评论数 */}
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs text-gray-500">{post.comments}</span>
                </div>

                {/* 图片或网格图标 */}
                <div className="flex items-center">
                  {post.hasImage ? (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 回到顶部按钮 */}
        <div className="flex justify-end mt-6">
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumRankings; 