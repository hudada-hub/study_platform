'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserForumPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 默认重定向到我的帖子页面
    router.push('/user/forum/posts');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-500">正在跳转到我的帖子...</p>
      </div>
    </div>
  );
};

export default UserForumPage; 