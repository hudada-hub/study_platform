'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/client-auth';

export default function UserProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // 获取当前用户ID并重定向到新的用户资料页面
    const currentUser = getCurrentUser();
    if (currentUser?.id) {
      // 如果用户已登录，重定向到新的个人资料路径
      router.replace(`/profile/${currentUser.id}`);
    } else {
      // 如果用户未登录，重定向到登录页面
      router.replace('/login');
    }
  }, [router]);

  // 显示加载状态
  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-gray-500">跳转中...</p>
      </div>
    </div>
  );
}
