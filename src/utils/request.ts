// src/utils/request.ts
import { ResponseUtil, ResponseCode } from './response';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface RequestOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

const BASE_URL = '/api';

// 使用 cookie 存储 token，设置过期时间为7天
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('token');
  }
  return null;
};

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); // 7天过期
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers = {
    // 只有当不是FormData且没有手动设置Content-Type时才添加默认的Content-Type
    ...(!(options.body instanceof FormData) && 
        !(options.headers instanceof Headers) && 
        !(options.headers as Record<string, string>)?.['Content-Type'] &&
        { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();
  
  // 处理401未授权状态
  if (data.code === 401) {
    // 清除token
    removeToken();
    
    // 显示提示
    Swal.fire({
      icon: 'warning',
      title: '提示',
      text: '登录已过期，请重新登录',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      position: 'top-end',
      toast: true
    });

    // 如果不是在登录页面，则跳转到登录页
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      // 保存当前页面路径
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
    }
    throw new Error(data.message);
  }

  // 处理其他错误状态
  if (data.code !== ResponseCode.SUCCESS) {
    // 提示通知
    Swal.fire({
      icon: 'error',
      title: '提示',
      text: data.message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      position: 'top-end',
      toast: true
    });
    throw new Error(data.message);
  }

  return data;
};