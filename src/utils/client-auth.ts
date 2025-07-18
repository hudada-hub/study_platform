import Cookies from 'js-cookie';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
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
  Cookies.set('token', token, COOKIE_OPTIONS);
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

