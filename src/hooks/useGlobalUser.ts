import { useState, useEffect, useCallback } from 'react';
import { request } from '@/utils/request';
import { ResponseUtil } from '@/utils/response';
import { setUserAuth, clearUserAuth, isAuthenticated } from '@/utils/client-auth';

interface UserInfo {
  id: number;
  nickname: string;
  email?: string;
  phone: string;
  bio?: string;
  avatar?: string;
  status: string;
  role: string;
  points: number;
  studyTime: number;
  courseCount: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  loginCount: number;
  lastLoginIp?: string;
  wechat?: string;
  qq?: string;
}

export const useGlobalUser = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    // 检查是否已登录
    if (!isAuthenticated()) {
      setUserInfo(null);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await request('/user/current', {
        method: 'GET',
      });

      if (ResponseUtil.success(response)) {
        const userData = response.data as UserInfo;
        setUserInfo(userData);
        
        // 更新cookie中的用户信息
        setUserInfo(userData); // 使用setUserInfo而不是setUserAuth
        
        return userData;
      } else {
        setError(response.message || '获取用户信息失败');
        return null;
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setError('获取用户信息失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新用户信息
  const refreshUserInfo = useCallback(async () => {
    return await fetchUserInfo();
  }, [fetchUserInfo]);

  // 清除用户信息
  const clearUser = useCallback(() => {
    setUserInfo(null);
    setError(null);
    clearUserAuth();
  }, []);

  // 页面加载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return {
    userInfo,
    loading,
    error,
    fetchUserInfo,
    refreshUserInfo,
    clearUser,
  };
}; 