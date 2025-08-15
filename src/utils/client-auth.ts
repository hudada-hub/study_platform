import Cookies from 'js-cookie';
import { User } from '@prisma/client';

// 客户端用户信息类型
interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  points?: number;
  studyTime?: number;
}

// 客户端用户类型（用于getCurrentUser返回）
export interface ClientUser {
  id: number;
  nickname: string;
  phone: string;
  email: string;
  avatar?: string;
  role: string;
  status: string;
  bio?: string;
  points: number;
  studyTime: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

// Cookie 配置
const COOKIE_OPTIONS = {
  expires: 7, // 7天过期
  path: '/',
  secure: process.env.NODE_ENV === 'production', // 生产环境下使用 HTTPS
  sameSite: 'strict' as const
};

// 设置和获取 token 的函数
export const setUserAuth = (token: string, userInfo: UserInfo) => {
  // 只有当token不为空时才设置token
  if (token) {
    Cookies.set('token', token, COOKIE_OPTIONS);
  }
  // 设置用户信息
  Cookies.set('userInfo', JSON.stringify(userInfo), COOKIE_OPTIONS);
};
export const setUserInfo = (userInfo: UserInfo) => {
  Cookies.set('userInfo', JSON.stringify(userInfo), COOKIE_OPTIONS);
};

export const getUserAuth = () => {
  const token = Cookies.get('token');
  const userInfo = Cookies.get('userInfo');
  return {
    token,
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  };
};

export const clearUserAuth = () => {
  Cookies.remove('token', { path: '/' });
  Cookies.remove('userInfo', { path: '/' });
  Cookies.remove('hasSeenWikiNotice', { path: '/' });
};

export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

// 从cookie中获取用户信息
export function getCurrentUser(): ClientUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const { userInfo } = getUserAuth();
    if (userInfo && userInfo.role) {
      // 将userInfo转换为ClientUser类型
      return {
        id: userInfo.id,
        nickname: userInfo.username || '',
        phone: userInfo.phone || '',
        email: userInfo.email,
        avatar: userInfo.avatar,
        role: userInfo.role,
        status: userInfo.status,
        bio: userInfo.bio || null,
        points: userInfo.points || 0,
        studyTime: userInfo.studyTime || 0,
        createdAt: userInfo.createdAt || new Date().toISOString(),
        updatedAt: userInfo.updatedAt || new Date().toISOString(),
        lastLoginAt: userInfo.lastLoginAt || new Date().toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}

// 检查用户是否为超级管理员
export function isSuperAdmin(user: ClientUser | null): boolean {
  return user?.role === 'SUPER_ADMIN';
}

// 检查用户是否为管理员
export function isAdmin(user: ClientUser | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
}

// 检查用户是否为版主
export function isModerator(user: ClientUser | null, sectionModeratorId?: number): boolean {
  if (!user) return false;
  return user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.id === sectionModeratorId;
}

// 检查用户是否有帖子管理权限
export function canManagePost(user: ClientUser | null, sectionModeratorId?: number): boolean {
  return isSuperAdmin(user) || isModerator(user, sectionModeratorId);
}

// 检查用户是否有内容审核权限
export function canModerateContent(user: ClientUser | null, sectionModeratorId?: number): boolean {
  return isSuperAdmin(user) || isModerator(user, sectionModeratorId);
}

