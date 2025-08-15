import React from 'react';

export interface CourseDirectoryChapter {
  id: number;
  title: string;
  children?: CourseDirectorySubChapter[];
  points: number;
  totalPoints?:number;
}

export interface CourseDirectorySubChapter {
  id: number;
  title: string;
  duration?: number | null;
  progress?: number; // 0-100
}

interface CourseDirectoryProps {
  chapters: CourseDirectoryChapter[];
  selectedSubChapterId?: number;
  onSubChapterClick?: (sub: CourseDirectorySubChapter) => void;
}

const numToChinese = (num: number) => {
  const cnNums = ['零','一','二','三','四','五','六','七','八','九','十'];
  if (num <= 10) return cnNums[num];
  if (num < 20) return '十' + cnNums[num % 10];
  if (num % 10 === 0) return cnNums[Math.floor(num / 10)] + '十';
  return cnNums[Math.floor(num / 10)] + '十' + cnNums[num % 10];
};

const CourseDirectory: React.FC<CourseDirectoryProps> = ({ chapters, selectedSubChapterId, onSubChapterClick }) => {
  // 移除折叠相关逻辑
  return (
    <div 
      className="w-full bg-[#181A20] text-gray-100 p-0 overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 #1F2937',
      }}
    >
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1F2937;
        }
      `}</style>
      {chapters.map((chapter, idx) => (
        <div key={chapter.id}>
          {/* 章节标题 */}
          <div
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold select-none border-b border-[#23242a] bg-[#181A20]"
          >
            {/* 不再显示折叠箭头 */}
            <span>{`第${numToChinese(idx + 1)}章：${chapter.title}`} </span>
          </div>
          {/* 子章节列表始终展开 */}
          {chapter.children && chapter.children.length > 0 && (
            <div className="px-2 py-1">
              {chapter.children.map((sub, subIdx) => (
                <div
                  key={sub.id}
                  className={`flex items-center px-6 py-2 rounded cursor-pointer transition-colors
                    ${selectedSubChapterId === sub.id ? 'bg-[#23242a] text-orange-400' : 'hover:bg-[#23242a]'}
                  `}
                  onClick={() => onSubChapterClick?.(sub)}
                >
                  <span className="text-xs text-gray-400 mr-2">课时{subIdx + 1}</span>
                  <span className="flex-1 truncate text-sm font-normal">{sub.title}</span>
                  <span className="text-xs text-orange-400 w-12 text-right">
                    {sub.duration ? 
                      (sub.duration < 60 ? `${sub.duration}秒` : `${Math.ceil(sub.duration / 60)}分钟`) 
                      : ''
                    }
                  </span>
                  {/* {JSON.stringify(sub)} */}
                  <span className="text-xs text-orange-400 w-10 text-right ml-2">{typeof sub.progress === 'number' ? `${Math.round(sub.progress)}%` : '0%'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseDirectory;