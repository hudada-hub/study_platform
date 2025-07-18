'use client';
import React, { useState, useEffect } from 'react';
import { request } from '@/utils/request';
import { setUserAuth, getUserAuth } from '@/utils/client-auth';
import { ResponseCode } from '@/utils/response';
import { useTheme } from '@/providers/theme-provider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { showError, showSuccess } from '@/utils/toast';

type PageMode = 'login' | 'forgotPassword';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    nickname?: string;
    avatar?: string;
    role: 'USER' | 'REVIEWER' | 'SUPER_ADMIN';
    status: 'ACTIVE' | 'INACTIVE';
    bio?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string;
  };
}

export default function LoginPage() {
  const [mode, setMode] = useState<PageMode>('login');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const { token } = getUserAuth();
    if (token) {
      router.replace('/'); // 如果已登录，重定向到首页
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await request<LoginResponse>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({
            account: formData.username,
            password: formData.password,
          }),
        }
      );
  
      if (response.code === ResponseCode.SUCCESS && response.data) {
        setUserAuth(response.data.token, response.data.user);
        showSuccess('登录成功');
        // 使用 setTimeout 确保 token 已经被保存
        setTimeout(() => {
          window.location.href = '/'; // 使用 window.location.href 进行页面刷新跳转
        }, 500);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        showError('两次输入的密码不一致');
        return;
      }

      const response = await request(
        '/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            newPassword: formData.newPassword,
          }),
        }
      );
  
      if (response.code === ResponseCode.SUCCESS) {
        showSuccess('密码重置成功，请使用新密码登录');
        setTimeout(() => {
          setMode('login');
        }, 2000);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError('重置密码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* 左侧部分 */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full text-white p-12">
          <h1 className="text-4xl font-bold mb-6">欢迎回来</h1>
          <p className="text-xl mb-8 text-center">
            继续您的学习之旅<br/>
            探索更多精彩内容
          </p>
          {/* Logo */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <Image
              src="/icon/logo.svg"
              alt="Logo"
              width={120}
              height={120}
              className="opacity-80"
            />
          </div>
          {/* 装饰效果 */}
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
              {mode === 'login' ? '用户登录' : '忘记密码'}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? '欢迎回到我们的社区' : '重置您的密码'}
            </p>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  用户名/手机号
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  密码
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: theme.textColor.primary }}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '登录中...' : '登录'}
              </button>

              <div className="flex flex-col space-y-2 text-sm text-center">
                <Link
                  href="/register"
                  style={{ color: theme.textColor.primary }}
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  没有账号？立即注册
                </Link>
                <button
                  type="button"
                  onClick={() => setMode('forgotPassword')}
                  style={{ color: theme.textColor.primary }}
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  忘记密码？
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  新密码
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-white/50 dark:bg-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: theme.textColor.primary }}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '处理中...' : '重置密码'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  style={{ color: theme.textColor.primary }}
                  className="text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  返回登录
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}