'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiEdit3 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

// 论坛菜单项接口
interface ForumMenuItem {
  key: string;
  label: string;
  href?: string;
  active?: boolean;
}

const forumMenuItems: ForumMenuItem[] = [
  { key: 'featured', label: '每日精选文章', href: '/forum' },
  { key: 'sections', label: '论坛版块列表', href: '/forum/sections' },
  { key: 'rankings', label: '排行榜', href: '/forum/rankings'  },
 
];

interface ForumMenuProps {
  className?: string;
}

const ForumMenu: React.FC<ForumMenuProps> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/forum/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className={cn('flex items-center justify-between px-6 py-4 border-b border-gray-200', className)}>
      {/* 左侧菜单项 */}
      <div className="flex items-center space-x-8">
        {forumMenuItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          
          if (item.href) {
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 pb-1',
                  isActive
                    ? 'text-gray-900 border-b-2 border-cyan-500'
                    : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                )}
              >
                {item.label}
              </Link>
            );
          } else {
            return (
              <button
                key={item.key}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {item.label}
              </button>
            );
          }
        })}
      </div>

      {/* 右侧搜索和发帖 */}
      <div className="flex items-center space-x-4">
        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="请输入搜索内容"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
            className="w-48 h-9 px-3 pr-10 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:bg-white"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </form>

        {/* 发帖按钮 */}
      </div>
    </div>
  );
};

export default ForumMenu; 