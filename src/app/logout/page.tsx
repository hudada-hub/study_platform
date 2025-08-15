'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearUserAuth } from '@/utils/client-auth';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 清除用户认证信息
    clearUserAuth();
    
    // 获取当前页面路径，跳转到原页面而不是首页
    const currentPath = window.location.pathname + window.location.search;
    // 如果不是logout页面，则跳转回去；否则跳转到首页
    if (currentPath !== '/logout') {
      window.location.href = currentPath;
    } else {
    router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 mb-4">正在退出登录...</div>
        <div className="text-sm text-gray-400">请稍候，即将跳转到首页</div>
      </div>
    </div>
  );
};

export default LogoutPage; 