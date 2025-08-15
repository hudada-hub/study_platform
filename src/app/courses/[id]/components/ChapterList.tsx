'use client';

import React, { useState } from 'react';
import { FiBook, FiPlay, FiPlayCircle, FiChevronRight } from 'react-icons/fi';

interface ChapterDetail {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  points: number;
  duration: number | null;
  children: ChapterDetail[];
  progress?: number;
  coverUrl: string | null; // 添加 coverUrl 属性
}

interface ChapterListProps {
  chapters: ChapterDetail[];
  selectedChapter: ChapterDetail | null;
  onChapterClick: (chapter: ChapterDetail) => Promise<void>; // 改为异步函数
  chapterProgress: { [key: number]: number };
  className?: string; // 添加可选的className属性以支持自定义样式
}

// 工具函数：阿拉伯数字转中文数字
const numToChinese = (num: number) => {
  const cnNums = ['零','一','二','三','四','五','六','七','八','九','十'];
  if (num <= 10) return cnNums[num];
  if (num < 20) return '十' + cnNums[num % 10];
  if (num % 10 === 0) return cnNums[Math.floor(num / 10)] + '十';
  return cnNums[Math.floor(num / 10)] + '十' + cnNums[num % 10];
};

export const ChapterList: React.FC<ChapterListProps> = ({ 
  chapters, 
  selectedChapter, 
  onChapterClick,
  chapterProgress,
  className = '' // 提供默认值
}) => {
  // 折叠状态，key为章节id，value为是否展开
  const [openMap, setOpenMap] = useState<{ [id: number]: boolean }>(
    () => Object.fromEntries(chapters.map(ch => [ch.id, true]))
  );

  const toggleOpen = (id: number) => {
    setOpenMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      {chapters.map((chapter, idx) => (
        <div key={chapter.id} className="mb-4">
          <div
            className="flex items-center gap-2 text-gray-700 mb-2 cursor-pointer select-none rounded-lg px-3 py-2 bg-gray-50 hover:bg-orange-50 transition group"
            onClick={() => toggleOpen(chapter.id)}
          >
            <FiChevronRight className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${openMap[chapter.id] ? 'rotate-90' : ''}`} />
            <span className="font-medium text-base tracking-wide">{`第${numToChinese(idx + 1)}章：${chapter.title}`}</span>
          </div>
          {openMap[chapter.id] && (
            <div className="space-y-1">
              {chapter.children?.map((subChapter, subIdx) => {
                const progress = chapterProgress[subChapter.id] || 0;
                return (
                  <div
                    key={subChapter.id}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors
                      ${selectedChapter?.id === subChapter.id 
                        ? 'bg-cyan-50 text-cyan-500' 
                        : 'hover:bg-gray-50'}`}
                    onClick={async () => await onChapterClick(subChapter)}
                  >
                    <div className="flex items-center gap-2 flex-1 justify-between">
                      <div className='flex items-center'>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full">
                          <FiPlayCircle className="text-cyan-400 text-base w-5 h-5" />
                        </span>
                        <span className="text-xs text-gray-400  mx-1">课时{subIdx + 1}：</span>
                        <span className="text-sm">{subChapter.title}</span>
                      </div>
                      {subChapter.duration && (
                        <span className="text-xs text-gray-400">
                          {subChapter.duration < 60 ? `${subChapter.duration}秒` : `${Math.ceil(subChapter.duration / 60)}分钟`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 