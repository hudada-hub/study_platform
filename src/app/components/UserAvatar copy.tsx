// src/app/components/UserAvatar.tsx
import React from 'react';
import { cookies } from 'next/headers';
import LoginButton from './LoginButton';
import { FaUser, FaCog, FaShoppingCart, FaHeart, FaBook, FaTasks, FaComments, FaSignOutAlt } from 'react-icons/fa';

const UserAvatar = async () => {
  // 服务器端获取cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userInfoStr = cookieStore.get('userInfo')?.value;
  
  let userInfo = null;
  if (userInfoStr) {
    try {
      userInfo = JSON.parse(userInfoStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
    }
  }

  // 如果未登录，显示登录按钮
  if (!token || !userInfo) {
    return <LoginButton onAfterClick={() => {}} />;
  }

  // 如果已登录，显示用户头像和基本信息
  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 focus:outline-none"
        id="user-avatar-button"
      >
        <div className="rounded-full flex items-center justify-center text-white">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.username}
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <FaUser className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
      </button>
      
      {/* 用户信息显示 */}
      <div className="hidden md:block ml-2 text-left">
        <div className="text-sm text-white font-medium">
          {userInfo?.nickname || userInfo?.username}
        </div>
        <div className="text-xs text-gray-300">
          积分: {userInfo?.points || 0}
        </div>
      </div>
      
      {/* 静态下拉菜单 - 服务器端渲染 */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="px-4 py-2 text-sm text-gray-700 border-b">
          <div className="font-medium">{userInfo?.nickname || userInfo?.username}</div>
          <div className="text-xs text-gray-500 mt-1">
            积分: {userInfo?.points || 0}
          </div>
        </div>
        <a
          href="/user/courses"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <FaBook className="mr-2" />
          课程管理
        </a>
        <a
          href="/user/forum"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <FaComments className="mr-2" />
          论坛管理
        </a>
        <a
          href="/user/tasks"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <FaTasks className="mr-2" />
          接单管理
        </a>
        <a
          href="/user/favorites"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <FaHeart className="mr-2" />
          我的收藏
        </a>
        <a
          href="/user/orders"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <FaShoppingCart className="mr-2" />
          我的订单
        </a>
        <a
          href={`/profile/${userInfo?.id}`}
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
          href="/logout"
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          退出登录
        </a>
      </div>
    </div>
  );
};

export default UserAvatar;