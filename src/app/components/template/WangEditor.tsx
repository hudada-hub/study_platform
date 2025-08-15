'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateElement } from '@wangeditor-next/editor';
import '@wangeditor-next/editor/dist/css/style.css';
import Cookies from 'js-cookie';
import { moderateImage } from '@/services/contentModeration';
import Swal from 'sweetalert2';

// 动态导入编辑器组件
const Editor = dynamic(
  () => import('@wangeditor-next/editor-for-react').then(mod => mod.Editor),
  { ssr: false }
);

const Toolbar = dynamic(
  () => import('@wangeditor-next/editor-for-react').then(mod => mod.Toolbar),
  { 
    ssr: false,
    loading: () => <div className="w-full h-8 bg-gray-100 rounded animate-pulse"></div>
  }
);

interface WangEditorProps {
  content?: string;
  defaultContent?: string;
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
  // 上传状态
  const [uploading, setUploading] = useState(false);

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
  }, [content, editor]);

  // 初始化时设置内容
  useEffect(() => {
    if (content && content !== html) {
      setHtml(content);
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
    defaultContent: content, // 添加 defaultContent 属性
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
            // 直接插入图片，因为已经在customUpload中处理了审核
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
        // 自定义上传处理
        customUpload(file: File, insertFn: (url: string) => void) {
          handleImageUpload(file, insertFn);
          return false; // 阻止默认上传
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

  // 图片上传前审核
  const handleImageUpload = async (file: File, insertFn: (url: string) => void) => {
    try {
      setUploading(true);
      
      // 先上传图片
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();
      if (result.code !== 0) {
        throw new Error(result.message || '上传失败');
      }

      const imageUrl = result.data.url;
      
      // 对上传的图片进行内容审核
      const moderationResult = await moderateImage(imageUrl);
      
      if (!moderationResult.success) {
        Swal.fire({
          icon: 'error',
          title: '审核失败',
          text: '图片审核服务异常，请稍后重试',
          confirmButtonText: '确定'
        });
        return;
      }
      
      if (!moderationResult.isSafe) {
        Swal.fire({
          icon: 'warning',
          title: '图片审核未通过',
          text: moderationResult.message,
          confirmButtonText: '确定'
        });
        return;
      }
      
      // 审核通过，插入图片
      insertFn(imageUrl);
      
    } catch (error) {
      console.error('图片上传失败:', error);
      Swal.fire({
        icon: 'error',
        title: '上传失败',
        text: error instanceof Error ? error.message : '图片上传失败',
        confirmButtonText: '确定'
      });
    } finally {
      setUploading(false);
    }
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
      {uploading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm">图片审核中...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}