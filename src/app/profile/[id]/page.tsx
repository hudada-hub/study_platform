'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { FaUser, FaCalendar, FaBook, FaClock, FaCoins, FaGraduationCap, FaComment, FaPlus, FaCheck } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';
import { CosImage } from '@/components/common/CosImage';
import { getCurrentUser } from '@/utils/client-auth';

interface UserProfile {
  id: number;
  nickname: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
  lastLoginAt: string;
  role: string;
  status: string;
  points: number;
  studyTime: number;
  loginCount: number;
  publishedCourseCount: number;
  postCount: number;
  replyCount: number;
  publishedTaskCount: number;
  acceptedTaskCount: number;
  totalEarnings: number;
  totalSpent: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查用户是否已登录
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (userId) {
      loadUserProfile();
    }
  }, [userId, router]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await request<UserProfile>(`/user/userprofile/${userId}`, {
        method: 'GET',
      });

      if (response.code === ResponseCode.SUCCESS && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || '获取用户资料失败');
      }
    } catch (err) {
      console.error('加载用户资料失败:', err);
      setError('加载用户资料失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error || '用户不存在'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 基本信息卡片 */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* 头像和基本信息区域 */}
          <div className="flex flex-col items-center p-12 border-b bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl mb-8">
              {profile.avatar ? (
                <CosImage
                  path={profile.avatar}
                  alt={profile.nickname}
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <FaUser className="w-16 h-16" />
                </div>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-3">{profile.nickname}</h1>
            <p className="text-sm text-gray-600 mb-1">{profile.email}</p>
            <p className="text-sm text-gray-700 text-center max-w-md">{profile.bio || '这个人很懒，什么都没写~'}</p>
            
            {/* 用户状态标签 */}
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                profile.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {profile.status === 'ACTIVE' ? '活跃' : 
                 profile.status === 'INACTIVE' ? '非活跃' : '未知'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {profile.role === 'SUPER_ADMIN' ? '超级管理员' :
                 profile.role === 'ADMIN' ? '管理员' :
                 profile.role === 'MODERATOR' ? '版主' : '普通用户'}
              </span>
            </div>
          </div>

          {/* 统计数据区域 */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">用户统计</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 积分 */}
              <div className="flex items-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FaCoins className="text-yellow-500 text-xl" />
                <div className="ml-3">
                  <div className="text-lg font-bold text-gray-900">{profile.points}</div>
                  <div className="text-xs text-gray-600">积分</div>
                </div>
              </div>

              {/* 学习时长 */}
              <div className="flex items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FaGraduationCap className="text-green-500 text-xl" />
                <div className="ml-3">
                  <div className="text-lg font-bold text-gray-900">{Math.floor(profile.studyTime / 60)}</div>
                  <div className="text-xs text-gray-600">学习时长(小时)</div>
                </div>
              </div>

              {/* 登录次数 */}
              <div className="flex items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FaUser className="text-blue-500 text-xl" />
                <div className="ml-3">
                  <div className="text-lg font-bold text-gray-900">{profile.loginCount}</div>
                  <div className="text-xs text-gray-600">登录次数</div>
                </div>
              </div>

              {/* 加入时间 */}
              <div className="flex items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <FaCalendar className="text-purple-500 text-xl" />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-600">加入时间</div>
                </div>
              </div>
            </div>

            {/* 内容统计 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">内容贡献</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaBook className="text-indigo-500" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{profile.publishedCourseCount}</div>
                    <div className="text-xs text-gray-600">发布课程</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaComment className="text-green-500" />
                  <div className="ml-3">
                    <div className="text-sm font-bold text-gray-900">{profile.postCount}</div>
                    <div className="text-xs text-gray-600">帖子</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaPlus className="text-orange-500" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{profile.publishedTaskCount}</div>
                    <div className="text-xs text-gray-600">发布任务</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaCheck className="text-blue-500" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{profile.acceptedTaskCount}</div>
                    <div className="text-xs text-gray-600">接受任务</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 最近登录时间 */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-sm">
              <div className="flex items-center">
                <FaClock className="text-gray-500 mr-3 text-lg" />
                <span className="text-sm text-gray-700 font-medium">
                  最近登录：{profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : '从未登录'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 