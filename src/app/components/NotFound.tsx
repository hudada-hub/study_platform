'use client'
import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NotFoundProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  showHomeButton?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = '页面不存在',
  description = '抱歉，您访问的页面不存在或已被删除',
  buttonText = '返回首页',
  buttonLink = '/',
  showHomeButton = true,
}) => {
  const router = useRouter();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* 404图片 */}
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="/images/404.svg"
          alt="404"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* 标题 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        {title}
      </h1>

      {/* 描述 */}
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        {description}
      </p>

      {/* 按钮组 */}
      <div className="flex gap-4">
        {/* 返回上一页按钮 */}
        <Button
          type="default"
          onClick={() => router.back()}
          className="min-w-[120px]"
        >
          返回上一页
        </Button>

        {/* 返回首页按钮 */}
        {showHomeButton && (
          <Button
            type="primary"
            onClick={() => router.push(buttonLink)}
            className="min-w-[120px]"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
