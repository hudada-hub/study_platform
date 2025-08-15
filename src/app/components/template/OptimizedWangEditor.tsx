'use client';

import React, { memo } from 'react';
import WangEditor from './WangEditor';

interface OptimizedWangEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  height?: number;
  maxImageSize?: number;
  maxVideoSize?: number;
  maxImageNumber?: number;
  maxVideoNumber?: number;
  uploadUrl?: string;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const OptimizedWangEditor = memo<OptimizedWangEditorProps>(({
  content = '',
  onChange,
  placeholder = '请输入内容...',
  height = 500,
  maxImageSize = 50 * 1024 * 1024,
  maxVideoSize = 50 * 1024 * 1024,
  maxImageNumber = 10,
  maxVideoNumber = 5,
  uploadUrl = '/api/common/upload',
  className = '',
  style = {},
  disabled = false,
}) => {
  return (
    <WangEditor
      content={content}
      onChange={onChange}
      placeholder={placeholder}
      height={height}
      maxImageSize={maxImageSize}
      maxVideoSize={maxVideoSize}
      maxImageNumber={maxImageNumber}
      maxVideoNumber={maxVideoNumber}
      uploadUrl={uploadUrl}
      className={className}
      style={style}
      disabled={disabled}
    />
  );
});

OptimizedWangEditor.displayName = 'OptimizedWangEditor';

export default OptimizedWangEditor; 