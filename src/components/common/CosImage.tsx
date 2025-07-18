'use client';

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import Image from 'next/image';

interface CosImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path: string;
  width: number;
  height: number;
}

/**
 * 获取图片组件
 * 这是一个客户端组件，用于自动刷新签名URL
 */
export const CosImage: FC<CosImageProps> = ({ path, ...props }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取签名URL
  const refreshUrl = async () => {
    try {
      const response = await fetch('/api/common/upload/refresh-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      const data = await response.json();
      if (data.code === 0) {
        setUrl(data.data.url);
        setError(null);
      } else {
        setError(data.message || '获取图片URL失败');
      }
    } catch (err) {
      setError('获取图片URL失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取URL
  useEffect(() => {
    if(path){
      refreshUrl();
    }

    // 每隔1小时刷新一次URL（避免URL过期）
    const timer = setInterval(refreshUrl, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">加载失败: {error}</div>;
  }

  // 从 props 中解构出 width 和 height，剩余的属性放入 restProps
  const { width, height, ...restProps } = props;
  return <Image src={url} width={width} height={height} alt="" {...restProps} />;
}; 