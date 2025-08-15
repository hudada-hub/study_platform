'use client';

import React from 'react';
import ForumMenu from '@/components/forum/ForumMenu';
import ForumRankings from '@/components/forum/ForumRankings';

// 模拟排行榜数据
const mockRankingsData = [
  {
    id: '1',
    rank: 1,
    category: 'web安全',
    title: 'MinIO import命令提权(CVE-2024-55949)漏洞',
    author: '精通linux开关机',
    date: '2024-12-20',
    views: 16594,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
  {
    id: '2',
    rank: 2,
    category: 'web安全',
    title: 'Tomcat条件竞争RCE漏洞(CVE-2024-50379)漏洞',
    author: '精通linux开关机',
    date: '2024-12-18',
    views: 7621,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
  {
    id: '3',
    rank: 3,
    category: 'web安全',
    title: 'Golang Crypto SSH 公钥认证绕过(CVE-2024-45337)漏洞',
    author: '精通linux开关机',
    date: '2024-12-17',
    views: 4914,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
  {
    id: '4',
    rank: 4,
    category: 'web安全',
    title: 'Spring Framework路径遍历漏洞(CVE-2024-38816/CVE-2024-38819)',
    author: '精通linux开关机',
    date: '2024-11-19',
    views: 5710,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
  {
    id: '5',
    rank: 5,
    category: 'web安全',
    title: 'WordPress-ReallySimpleSecurity插件认证绕过漏洞(CVE-2024-10924)',
    author: '精通linux开关机',
    date: '2024-11-19',
    views: 3435,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
  {
    id: '6',
    rank: 6,
    category: '内网攻防',
    title: '内网渗透信息搜集骚姿势',
    author: 'Aabyss曾哥',
    date: '2024-7-6',
    views: 20186,
    comments: 0,
    hasImage: false,
    hasThumbsUp: true,
  },
  {
    id: '7',
    rank: 7,
    category: 'web安全',
    title: '甲方人工代码审计心得、技巧经验分享',
    author: '代码审计专家',
    date: '2024-6-15',
    views: 2891,
    comments: 0,
    hasImage: true,
    hasThumbsUp: false,
  },
];

export default function ForumRankingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <ForumMenu />
          <div className="p-6">
            <ForumRankings rankings={mockRankingsData} />
          </div>
        </div>
      </div>
    </div>
  );
} 