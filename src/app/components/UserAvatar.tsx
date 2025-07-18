// src/app/components/UserAvatar.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { getUserAuth, clearUserAuth } from '@/utils/client-auth';
import LoginButton from './LoginButton';
import { FaUser, FaCog, FaShoppingCart, FaHeart, FaBook, FaTasks, FaComments, FaSignOutAlt } from 'react-icons/fa';

const UserAvatar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInfo = getUserAuth().userInfo;

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserAuth();
    window.location.href='/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className=" rounded-full flex items-center justify-center text-white">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.username}
              className="w-8 h-8 rounded-full object-cover w-8 h-8 border-2 border-white"
            />
          ) : (
            <LoginButton onAfterClick={() => setIsDropdownOpen(false)} />
          )}
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md  py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            {userInfo?.username}
          </div>
          <a
            href="/user/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaUser className="mr-2" />
            个人资料
          </a>
          <a
            href="/user/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaCog className="mr-2" />
            账号设置
          </a>
          <a
            href="/user/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaShoppingCart className="mr-2" />
            我的订单
          </a>
          <a
            href="/user/favorites"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaHeart className="mr-2" />
            我的收藏
          </a>
          <a
            href="/user/courses"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaBook className="mr-2" />
          课程管理
          </a>
          <a
            href="/user/tasks"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaTasks className="mr-2" />
          接单管理
          </a>
          <a
            href="/user/forum"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FaComments className="mr-2" />
          论坛管理
          </a>
         
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            退出登录
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;