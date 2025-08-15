'use client';

import React, { useEffect, useState } from 'react';
import ForumMenu from '@/components/forum/ForumMenu';
import ForumSectionsList from '@/components/forum/ForumSectionsList';
import { ForumCategory } from '@/types/forum';
import { request } from '@/utils/request';

export default function ForumSectionsPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await request< ForumCategory[] >('/forum/sections',{
        method: 'GET',
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error('获取论坛板块失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <ForumMenu />
          <div className="p-6">
            <h1 className="text-xl font-medium text-gray-900 mb-6">论坛版块列表</h1>
            <ForumSectionsList categories={categories} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
} 