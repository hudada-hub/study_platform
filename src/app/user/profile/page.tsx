'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { FaUser, FaCalendar, FaBook, FaClock, FaGamepad, FaCoins, FaGraduationCap } from 'react-icons/fa';
import Link from 'next/link';
import { setUserInfo } from '@/utils/client-auth';
interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
  lastLoginAt: string;
  role: string;
  status: string;
  points: number;
  studyTime: number;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const [profileRes] = await Promise.all([
        request<UserProfile>('/user/profile',{method:'GET',}),
      ]);

      if (profileRes.code === ResponseCode.SUCCESS && profileRes.data) {
        setProfile(profileRes.data);
        setUserInfo({
          id: profileRes.data.id, 
          username: profileRes.data.username,
          email: profileRes.data.email,
          role: profileRes.data.role,
          status: profileRes.data.status,
          avatar: profileRes.data.avatar,
          bio: profileRes.data.bio,
          createdAt: profileRes.data.createdAt,
          lastLoginAt: profileRes.data.lastLoginAt,
          points: profileRes.data.points,
          studyTime: profileRes.data.studyTime,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* 基本信息卡片 */}
      <div className="bg-white rounded-lg overflow-hidden">
        {/* 头像和基本信息区域 */}
        <div className="flex flex-col items-center p-6 border-b">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm mb-4">
            <img
              src={profile.avatar || '/images/default-avatar.png'}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-medium text-gray-900">{profile.username}</h1>
          <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
          <p className="text-sm text-gray-700 mt-2 text-center">{profile.bio || '这个人很懒，什么都没写~'}</p>
          <Link
            href="/user/settings"
            className="mt-4 px-6 py-2 bg-primary text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
          >
            编辑资料
          </Link>
        </div>

        {/* 统计数据区域 */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* 积分 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaCoins className="text-yellow-500 text-xl" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{profile.points}</div>
                <div className="text-xs text-gray-600">积分</div>
              </div>
            </div>

            {/* 学习时长 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaGraduationCap className="text-green-500 text-xl" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{Math.floor(profile.studyTime / 60)}</div>
                <div className="text-xs text-gray-600">学习时长(小时)</div>
              </div>
            </div>

            {/* 用户角色 */}
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaUser className="text-indigo-500 text-xl" />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {profile.role === 'USER' ? '普通用户' : '管理员'}
                </div>
                <div className="text-xs text-gray-600">用户角色</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaCalendar className="text-purple-500 text-xl" />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600">加入时间</div>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FaClock className="text-orange-500 text-xl" />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(profile.lastLoginAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-600">最近登录</div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
