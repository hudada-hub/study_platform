import React, { ReactNode } from 'react';
import { useTheme } from '@/providers/theme-provider';
import Image from 'next/image';

interface TitleBarProps {
  /**
   * 标题文本
   */
  title: string;
  /**
   * 背景颜色
   */
  backgroundColor?: string;
  /**
   * 右侧内容插槽
   */
  rightContent?: ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义样式
   */
  style?: React.CSSProperties;
}

/**
 * 标题栏组件
 * @param props 组件属性
 * @returns JSX.Element
 */
const TitleBar: React.FC<TitleBarProps> = ({
  title,
  rightContent,
  className = '',
  style = {},
}) => {
    const {theme} = useTheme()
    const currentBgColor = theme.backgroundColor.primary;
    const textColor = theme.textColor.primary;
  
  return (
    <div 
      className={`flex items-center justify-between rounded-sm mb-3 px-4 py-1 ${className}`}
      style={{
        backgroundColor:currentBgColor,
        ...style
      }}
    >
      <div className="flex items-center">
        <div className="w-[10px] h-[35px]  rounded mr-2">
            <Image src="/prefix.png" alt="title-bar-bg" width={12} height={43} />
        </div>
        <h2 className="text-lg font-medium" style={{color:textColor}}>{title}</h2>
      </div>
      
      {rightContent && (
        <div className="flex items-center">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default TitleBar; 