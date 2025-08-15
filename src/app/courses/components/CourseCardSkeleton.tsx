import React from 'react';

/**
 * 课程卡片骨架屏组件（现代极简风格，纯tailwindcss）
 */
const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden w-[220px] h-[270px] flex flex-col animate-pulse select-none border border-gray-100">
      {/* 封面骨架 */}
      <div className="relative w-[270px] h-[170px] bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200">
        <div className="w-full h-full rounded-t-xl bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200" />
        <div className="absolute top-2 right-2">
          <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 w-10 h-5" />
        </div>
      </div>
      {/* 内容骨架 */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded mb-3 w-4/5" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-10" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton; 