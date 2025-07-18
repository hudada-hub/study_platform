import { useState } from 'react';
import { getToken } from '@/utils/request';
import { Notification } from '@/utils/notification';

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 图片上传组件
 * 用于图片的上传、预览和删除
 */
export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/common/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      const data = await response.json();
      if (data.code === 0) {
        onChange(data.data.url);
      } else {
        throw new Error(data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      Notification.error('图片上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 处理图片删除
  const handleDeleteImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={value}
            alt="上传的图片"
            className="w-full h-full object-contain"
          />
          <button
            onClick={handleDeleteImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      <div className="flex items-center justify-center">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50">
          <div className="flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            )}
          </div>
          <span className="mt-2 text-sm text-gray-500">
            {uploading ? '上传中...' : '点击或拖拽上传图片'}
          </span>
          <input
            type="file"
            style={{display:'none'}}
            className="hidden"
            accept="image/*"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleImageUpload(file);
            }}
          />
        </label>
      </div>
    </div>
  );
} 