'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import UserAvatar from './UserAvatar';
import { isAuthenticated, clearUserAuth } from '@/utils/client-auth';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { useArticleCategory } from '@/providers/article-category-provider';
import LoginButton from './LoginButton';
import { useTheme } from '@/providers/theme-provider';
import { useUser } from '@/providers/user-provider';

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const params = useParams();
  const {categories}= useArticleCategory();
  const {theme,resetTheme} = useTheme();
  const { userInfo } = useUser();

  useEffect(() => {
    // 使用全局用户信息来判断登录状态
    setIsLoggedIn(!!userInfo);
    // 当菜单打开时，禁止页面滚动
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, userInfo]);

  useEffect(()=>{
    resetTheme()
  },[theme])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* 左侧 Logo 和导航 */}
          <div className="flex items-center flex-1">
            {/* 桌面端导航菜单 */}
            <nav className="hidden lg:flex space-x-1 text-gray-700">
              <Link 
                href="/"
                className={`px-3 py-2 rounded-md hover:bg-gray-100 hover:text-cyan-500 ${
                  pathname === '/' ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                首页
              </Link>
              <Link 
                href="/courses"
                className={`px-3 py-2 rounded-md hover:bg-gray-100 hover:text-cyan-500 ${
                  pathname.startsWith('/courses') ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                课程
              </Link>
              <Link 
                href="/forum"
                className={`px-3 py-2 rounded-md hover:bg-gray-100 hover:text-cyan-500 ${
                  pathname.startsWith('/forum') ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                论坛
              </Link>
              <Link 
                href="/tasks"
                className={`px-3 py-2 rounded-md hover:bg-gray-100 hover:text-cyan-500 ${
                  pathname.startsWith('/tasks') ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                接单
              </Link>
              <Link 
                href="/games"
                className={`px-3 py-2 rounded-md hover:bg-gray-100 hover:text-cyan-500 ${
                  pathname.startsWith('/games') ? 'text-cyan-500 font-medium' : ''
                }`}
              >
                游戏入口
              </Link>
              {/* {categories
                .filter(category => category.isEnabled)
                .map(category => (
                  <div
                    key={category.id}
                    className="relative group"
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <button
                      className={`px-3 py-2 rounded-md flex items-center gap-1 hover:bg-gray-100 hover:text-cyan-500 ${
                        activeCategory === category.id ? 'text-cyan-500 font-bold' : ''
                      }`}
                      onClick={() => router.push(`/articles?categoryId=${category.id}`)}
                    >
                      {category.name}
                      {category.children.length > 0 && (
                        <svg
                          className="w-4 h-4 group-hover:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>
                  
                    {category.children.length > 0 && (
                      <div
                        className={`absolute left-0 mt-1 w-48 bg-white rounded-md py-1 shadow border border-gray-100 transition-all transform origin-top-left
                          ${activeCategory === category.id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                        `}
                      >
                        {category.children
                          .filter(child => child.isEnabled)
                          .map(child => (
                            <Link
                              key={child.id}
                              href={`/articles?categoryId=${child.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-cyan-500"
                            >
                              {child.name}
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                ))} */}
            </nav>
          </div>
          {/* 右侧搜索和操作按钮 */}
          <div className="flex items-center gap-4">
            {/* 搜索框 */}
            
            {/* 用户头像或登录按钮 */}
            {isLoggedIn ? (
              <UserAvatar />
            ) : (
              <LoginButton />
            )}
            {/* 移动端菜单按钮 */}
            <button
              className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* 移动端导航菜单 - 从右侧滑出 */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* 背景遮罩 - 带模糊效果 */}
        <div 
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* 菜单内容 - 从右侧滑出 */}
        <div 
          className={`absolute inset-y-0 right-0 w-[280px] bg-white transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* 菜单头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/icon/logo.svg" alt="Logo" className="h-8" />
            </Link>
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* 菜单内容区域 */}
          <div className="overflow-y-auto h-[calc(100vh-5rem)]">
            {/* 搜索框 */}
            
            {/* 导航链接 */}
            <nav className="px-2 py-2">
              <Link
                href="/"
                className={`block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  pathname === '/' ? 'text-cyan-500 font-medium bg-cyan-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                href="/courses"
                className={`block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  pathname.startsWith('/courses') ? 'text-cyan-500 font-medium bg-cyan-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                课程
              </Link>
              <Link
                href="/forum"
                className={`block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  pathname.startsWith('/forum') ? 'text-cyan-500 font-medium bg-cyan-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                论坛
              </Link>
              <Link
                href="/tasks"
                className={`block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  pathname.startsWith('/tasks') ? 'text-cyan-500 font-medium bg-cyan-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                接单
              </Link>
              <Link
                href="/games"
                className={`block px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 ${
                  pathname.startsWith('/games') ? 'text-cyan-500 font-medium bg-cyan-50' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                游戏入口
              </Link>
              {/* {categories
                .filter(category => category.isEnabled)
                .map(category => (
                  <div key={category.id} className="py-1">
                    <button
                      className="w-full px-3 py-2.5 rounded-lg text-gray-700 text-left flex items-center justify-between hover:bg-gray-100 hover:text-cyan-500"
                      onClick={() => {
                        router.push(`/articles?categoryId=${category.id}`);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span>{category.name}</span>
                      {category.children.length > 0 && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </button>
                    {category.children
                      .filter(child => child.isEnabled)
                      .map(child => (
                        <Link
                          key={child.id}
                          href={`/articles?categoryId=${child.id}`}
                          className="block px-6 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-cyan-500"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                  </div>
                ))} */}
            </nav>
          </div>
          {/* 底部操作区 */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            <div className="space-y-3">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    clearUserAuth();
                    // 跳转到当前页面，让用户停留在原页面
                    window.location.href = window.location.pathname + window.location.search;
                  }}
                  className="w-full px-4 py-2 text-red-600 rounded-lg text-center hover:bg-gray-100"
                >
                  退出登录
                </button>
              ) : (
                <LoginButton 
                  isMobile={true} 
                  onAfterClick={() => setIsMobileMenuOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;