'use client';
import RegisterForm from '../components/auth/RegisterForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setUserAuth, getUserAuth } from '@/utils/client-auth';
import { useEffect } from 'react';
import { showSuccess } from '@/utils/toast';

export default function RegisterPage() {
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    const { token } = getUserAuth();
    if (token) {
      router.replace('/'); // 如果已登录，重定向到首页
    }
  }, [router]);

  const handleSuccess = (token: string, user: any) => {
    setUserAuth(token, user);
    showSuccess('注册成功');
    // 使用 setTimeout 确保 token 已经被保存
    setTimeout(() => {
      window.location.href = '/'; // 使用 window.location.href 进行页面刷新跳转
    }, 500);
  };

  const handleSwitchMode = () => {
    router.push('/login'); // 切换到登录页面
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* 左侧部分 */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" /> {/* 添加一个暗色遮罩 */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full text-white p-12">
          <h1 className="text-4xl font-bold mb-6">欢迎加入我们</h1>
          <p className="text-xl mb-8 text-center">
            开启你的学习之旅<br/>
            探索无限可能
          </p>
          {/* 添加一些装饰性元素 */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <Image
              src="/icon/logo.svg"
              alt="Logo"
              width={120}
              height={120}
              className="opacity-80"
            />
          </div>
          {/* 添加一些动态装饰 */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute w-64 h-64 rounded-full bg-white/10 -top-20 -left-20 blur-2xl" />
            <div className="absolute w-64 h-64 rounded-full bg-purple-500/20 -bottom-20 -right-20 blur-2xl" />
          </div>
        </div>
      </div>

      {/* 右侧部分 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              创建新账号
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              已有账号？
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                立即登录
              </a>
            </p>
          </div>
          
          <div className="mt-8">
            <RegisterForm 
              onSuccess={handleSuccess}
              onSwitchMode={handleSwitchMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 