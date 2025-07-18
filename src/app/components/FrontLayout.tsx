'use client';
import React, { Suspense } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { Spin } from 'antd';

interface FrontLayoutProps {
  children: React.ReactNode;
}

/**
 * 前台布局组件内容
 */
const FrontLayoutContent: React.FC<FrontLayoutProps> = ({ children }) => {
  const {wikiName,moduleName,detailName} = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const edit = searchParams.get('edit');
  const params = useParams();
  const isEditPage = !!edit;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 页头 */}
      {!wikiName && <Header  />}
      
      {/* 主要内容区域 */}
      <main className="flex-grow w-full mx-auto bg-zinc-50">
        {children}
      </main>
      
      {/* 页脚 - 在编辑页面不显示 */}
      {!isEditPage && <Footer />}
    </div>
  );
};

/**
 * 前台布局组件
 * 包含页头和页脚，适用于所有前台页面
 */
const FrontLayout: React.FC<FrontLayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    }>
      <FrontLayoutContent children={children} />
    </Suspense>
  );
};

export default FrontLayout;