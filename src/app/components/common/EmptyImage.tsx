import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyImageProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  containerClassName?: string;
}

const EmptyImage: React.FC<EmptyImageProps> = ({
  size = 'md',
  className,
  containerClassName,
}) => {
  // 根据尺寸设置类名
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
    },
  };

  return (
    <div
      className={cn(
        'w-full h-full flex items-center justify-center',
        containerClassName
      )}
    >
      <div
        className={cn(
          sizeClasses[size].container,
          'bg-gray-50 rounded-lg w-full h-full  aspect-square flex items-center justify-center',
          'border-2 border-dashed border-gray-200',
          'transition-all duration-200 ease-in-out',
          'group',
          className
        )}
      >
        图片占位
      </div>
    </div>
  );
};

export default EmptyImage; 