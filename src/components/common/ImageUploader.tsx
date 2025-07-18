'use client';

import React, { useState } from 'react';
import { FaUpload, FaSpinner, FaImage, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { getToken } from '@/utils/request';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
}

export default function ImageUploader({
  value,
  onChange,
  className = '',
  placeholder = '点击或拖拽上传图片',
  type = 'default'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setError('');
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);  
      formData.append('type', type);

      const response = await fetch('/api/common/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
     

      const result = await response.json();
      if (result.code === 0) {
        onChange(result.data.url);
      } else {
        setError(result.message || '上传失败');
      }
    } catch (err) {
      setError('上传失败，请重试');
      console.error('上传失败:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件');
        return;
      }
      handleUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${error ? 'border-red-500' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-4">
            <FaSpinner className="animate-spin text-2xl text-blue-500 mb-2" />
            <span className="text-gray-600">上传中...</span>
          </div>
        ) : value ? (
          <div className="relative group">
            <div className="relative w-full aspect-video">
              <Image
                src={value}
                alt="预览图片"
                fill
                className="object-cover rounded"
              />
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8">
            <FaImage className="text-4xl text-gray-400 mb-2" />
            <p className="text-gray-600">{placeholder}</p>
            <p className="text-sm text-gray-500 mt-1">支持拖拽上传</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
} 