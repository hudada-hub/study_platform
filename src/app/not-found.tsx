import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      {/* 404图片 */}
      <div className="relative w-64 h-64 mb-8">
        
      </div>

      {/* 标题 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        页面不存在
      </h1>

      {/* 描述 */}
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        抱歉，您访问的页面不存在或已被删除
      </p>

      {/* 按钮组 */}
      <div className="flex gap-4">
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 transition-colors min-w-[120px]"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
} 