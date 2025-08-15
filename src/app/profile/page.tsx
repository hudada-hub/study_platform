'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRootPage() {
  const router = useRouter();

  useEffect(() => {
    // 如果没有指定用户ID，重定向到登录页面
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="text-sm text-gray-500">跳转中...</p>
      </div>
    </div>
  );
} 