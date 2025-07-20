'use client';

import React from 'react';
import { FiBook } from 'react-icons/fi';

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

export const ChapterList: React.FC<ChapterListProps> = ({ 
  chapters, 
  selectedChapter, 
  onChapterClick,
  chapterProgress,
  className = '' // 提供默认值
}) => {
  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <FiBook className="text-lg" />
            <span className="font-medium">{chapter.title}</span>
          </div>
          <div className="space-y-1">
            {chapter.children?.map((subChapter) => {
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
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm">{subChapter.title}</span>
                    {subChapter.duration && (
                      <span className="text-xs text-gray-400">{Math.ceil(subChapter.duration / 60)}分钟</span>
                    )}
                    {/* 学习进度指示器 */}
                    {progress > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}; 