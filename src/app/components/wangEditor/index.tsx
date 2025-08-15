'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateElement } from '@wangeditor-next/editor';
import '@wangeditor-next/editor/dist/css/style.css';
import Cookies from 'js-cookie';

// 动态导入编辑器组件
const Editor = dynamic(
  () => import('@wangeditor-next/editor-for-react').then(mod => mod.Editor),
  { ssr: false }
);

const Toolbar = dynamic(
  () => import('@wangeditor-next/editor-for-react').then(mod => mod.Toolbar),
  { ssr: false }
);

interface WangEditorProps {
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

// 自定义上传响应类型
interface UploadResponse {
  code: number;
  data: {
    url: string;
  };
  message?: string;
}

export default function WangEditor({
  content = '',
  onChange,
  placeholder = '请输入内容...',
  height = 500,
  maxImageSize = 50 * 1024 * 1024, // 默认50MB
  maxVideoSize = 50 * 1024 * 1024, // 默认50MB
  maxImageNumber = 10,
  maxVideoNumber = 5,
  uploadUrl = '/api/common/upload',
  className = '',
  style = {},
  disabled = false,
}: WangEditorProps) {
  // 编辑器实例
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  // 编辑器内容
  const [html, setHtml] = useState<string>(content);

  // 组件销毁时销毁编辑器实例
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // 同步外部传入的 value
  useEffect(() => {
    if (editor && content !== html) {
      setHtml(content);
      editor.setHtml(content);
    }
  }, [content]);

  // 获取 token
  const getToken = () => {
    if (typeof window === 'undefined') return '';
    return Cookies.get('token') || '';
  };

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: disabled ? ['uploadImage', 'uploadVideo', 'insertLink', 'editLink'] : [],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    readOnly: disabled,
    autoFocus: false,
    MENU_CONF: {
      uploadImage: {
        server: uploadUrl,
        fieldName: 'file',
        maxFileSize: maxImageSize,
        maxNumberOfFiles: maxImageNumber,
        allowedFileTypes: ['image/*'],
        meta: {},
        metaWithUrl: true,
        withCredentials: true,
        timeout: 30 * 1000,
 
        headers: {
           //@ts-ignore
          Authorization: `Bearer ${getToken()}`,
        },
        customInsert(res: UploadResponse, insertFn: (url: string) => void) {
          if (res.code === 0) {
            insertFn(res.data.url);
          } else {
            throw new Error(res.message || '上传失败');
          }
        },
        onFailed(_: any, res: UploadResponse) {
          console.error('上传失败:', res);
            throw new Error(res.message || '上传失败');
        },
        onError(_: any, err: Error) {
          console.error('上传出错:', err);
          throw err;
        },
      },
      uploadVideo: {
        server: uploadUrl,
        fieldName: 'file',
        maxFileSize: maxVideoSize,
        maxNumberOfFiles: maxVideoNumber,
        allowedFileTypes: ['video/*'],
        meta: {},
        metaWithUrl: true,
        withCredentials: true,
        timeout: 60 * 1000,
        headers: {
          //@ts-ignore
          Authorization: `Bearer ${getToken()}`,
        },
        customInsert(res: UploadResponse, insertFn: (url: string) => void) {
          if (res.code === 0) {
            insertFn(res.data.url);
          } else {
            throw new Error(res.message || '上传失败');
          }
        },
        onFailed(_: any, res: UploadResponse) {
          console.error('上传失败:', res);
            throw new Error(res.message || '上传失败');
        },
        onError(_: any, err: Error) {
          console.error('上传出错:', err);
          throw err;
        },
      },
    },
  };

  // 内容变化时的处理函数
  const handleChange = (editor: IDomEditor) => {
    const newHtml = editor.getHtml();
    setHtml(newHtml);
    onChange?.(newHtml);
  };

  return (
    <div className={`border rounded-md ${className}`} style={{ zIndex: 100, ...style }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={handleChange}
        mode="default"
        style={{ 
          height: `${height}px`,
          overflowY: 'hidden',
          ...(disabled ? { cursor: 'not-allowed', background: '#f5f5f5' } : {})
        }}
      />
    </div>
  );
} 