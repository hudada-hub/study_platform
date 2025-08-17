import React from 'react';
import Link from 'next/link';

// 排行榜帖子数据类型
interface RankingPost {
  id: string;
  title: string;
  content: string;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  coverUrl: string;
  likeCount: number;
  section: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  author: {
    id: string;
    nickname: string;
    avatar: string;
  };
}

interface ForumRankingsProps {
  rankings: RankingPost[];
}

const ForumRankings: React.FC<ForumRankingsProps> = ({ rankings }) => {
  console.log(rankings,'rankings');
  return (
    <div className="bg-white rounded-lg">
      {/* 标题栏 */}
      <div className="flex items-center p-6 border-b border-gray-100">
        <div className="w-1 h-4 bg-gray-300 mr-3"></div>
        <h1 className="text-lg text-gray-900">帖子排行</h1>
      </div>

      {/* 排行榜列表 */}
      <div className="p-6">
        <div className="space-y-4">
          {rankings.map((post) => (
            <div key={post.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 transition-colors rounded-lg">
              {/* 左侧头像 */}
              <div className="flex-shrink-0">
                {post.author?.avatar ? (
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.nickname}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 中间内容区域 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Link 
                    target='_blank'
                    href={`/forum/sections/${post.section?.id}`}
                    className="text-xs text-cyan-600 hover:text-cyan-800 hover:underline"
                  >
                    [{post.section?.name}]
                  </Link>
                  <span className="text-xs text-gray-400">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('zh-CN') : '未知'}
                  </span>
                </div>
                <Link   
                  target='_blank'
                  href={`/forum/posts/${post.id}`}
                  className="block hover:text-cyan-600 transition-colors"
                >
                  <h3 className="text-sm text-gray-900 line-clamp-2 mb-1">
                    {post.title}
                  </h3>
                </Link>
                <div className="text-xs text-gray-500">
                  {post.author?.nickname || '未知用户'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString('zh-CN') : '未知'}
                </div>
              </div>

              {/* 右侧数据 */}
              <div className="flex-shrink-0 flex items-center space-x-4">
                <span className="text-xs text-gray-500">{post.viewCount}</span>
                <span className="text-xs text-gray-500">{post.commentCount}</span>
                <span className="text-xs text-gray-500">{post.likeCount}</span>
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