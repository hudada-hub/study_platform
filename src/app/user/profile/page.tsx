'use client';

import React, { useEffect, useState } from 'react';
import { request } from '@/utils/request';
import { ResponseCode } from '@/utils/response';
import { FaUser, FaCalendar, FaBook, FaClock, FaGamepad } from 'react-icons/fa';
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
  totalWikis: number;
  role: string;
  status: string;
}

interface Activity {
  id: string;
  type: 'wiki_create' | 'wiki_edit' | 'game_add' | 'game_edit';
  title: string;
  targetId: string;
  createdAt: string;
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
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
        });
      }

     
    } finally {
      setIsLoading(false);
    }
  };

  


  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4 space-y-8">
      {/* 个人信息卡片 */}
      <div className="bg-white rounded-lg  overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
              <img
                src={profile.avatar || '/images/default-avatar.png'}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-20 pb-6 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>
            <Link
              href="/user/settings"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              编辑资料
            </Link>
          </div>
          
          <p className="mt-4 text-gray-700">{profile.bio || '这个人很懒，什么都没写~'}</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaBook className="mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{profile.totalWikis}</div>
              <div className="text-sm text-gray-600">Wiki</div>
            </div>
          
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaCalendar className="mx-auto text-purple-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">加入时间</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FaClock className="mx-auto text-orange-500 mb-2" />
              <div className="text-sm font-medium text-gray-900">
                {new Date(profile.lastLoginAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">最近登录</div>
            </div>
          </div>
        </div>
      </div>

     
      
    </div>
  );
}
