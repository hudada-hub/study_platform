'use client';

import React, { useEffect, useState } from 'react';


import { FaUser, FaBook, FaClock } from 'react-icons/fa';
import Link from 'next/link';

interface UserStats {
  totalWikis: number;
  activeWikis: number;
  lastLoginTime: string;
}

interface RecentActivity {
  id: string;
  type: 'create' | 'update';
  wikiName: string;
  wikiId: string;
  timestamp: string;
}

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <FaBook className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">总Wiki数</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.totalWikis || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <FaUser className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">活跃Wiki</p>
              <p className="text-2xl font-semibold text-gray-900">{stats?.activeWikis || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <FaClock className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">上次登录</p>
              <p className="text-sm font-semibold text-gray-900">
                {stats?.lastLoginTime ? new Date(stats.lastLoginTime).toLocaleString() : '未知'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">暂无活动记录</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'create' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <FaBook className={`h-5 w-5 ${
                      activity.type === 'create' ? 'text-green-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type === 'create' ? '创建了新Wiki' : '更新了Wiki'}：
                      <Link href={`/wikis/${activity.wikiId}`} className="text-blue-600 hover:text-blue-800">
                        {activity.wikiName}
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
