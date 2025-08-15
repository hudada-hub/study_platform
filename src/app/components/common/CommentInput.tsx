'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { FaceSmileIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import UserAvatar from './UserAvatar';
import { useTheme } from '@/providers/theme-provider';
import { moderateText, moderateImages } from '@/services/contentModeration';
import Swal from 'sweetalert2';

interface CommentInputProps {
  onSubmit: (content: string, images?: string[]) => void;
  placeholder?: string;
  replyingTo?: {
    username: string;
  };
  onCancelReply?: () => void;
  avatarUrl?: string;
}

export const CommentInput = ({
  onSubmit,
  placeholder = '发表你的评论...',
  replyingTo,
  onCancelReply,
  avatarUrl = '/default-avatar.png'
}: CommentInputProps) => {
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理表情选择
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // 处理图片上传
  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;
    
    // 限制最多上传9张图片
    if (images.length + files.length > 9) {
      Swal.fire({
        icon: 'warning',
        title: '提示',
        text: '最多可上传9张图片',
        confirmButtonText: '确定'
      });
      return;
    }

    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          throw new Error('只能上传图片文件');
        }
        
        // 验证文件大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('图片大小不能超过5MB');
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/common/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.code === 0) {
          return result.data.url;
        } else {
          throw new Error(result.message || '上传失败');
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // 对上传的图片进行内容审核
      if (uploadedUrls.length > 0) {
        const moderationResults = await moderateImages(uploadedUrls);
        const unsafeImages = moderationResults.filter(result => !result.isSafe);
        
        if (unsafeImages.length > 0) {
          Swal.fire({
            icon: 'warning',
            title: '图片审核未通过',
            text: `有${unsafeImages.length}张图片包含违规内容，已自动移除`,
            confirmButtonText: '确定'
          });
          
          // 只保留安全的图片
          const safeUrls = uploadedUrls.filter((_, index) => moderationResults[index].isSafe);
          setImages(prev => [...prev, ...safeUrls]);
        } else {
          setImages(prev => [...prev, ...uploadedUrls]);
        }
      }
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

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // 处理评论提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    
    // 如果有文本内容，进行内容审核
    if (content.trim()) {
      const moderationResult = await moderateText(content);
      
      if (!moderationResult.success) {
        Swal.fire({
          icon: 'error',
          title: '审核失败',
          text: '内容审核服务异常，请稍后重试',
          confirmButtonText: '确定'
        });
        return;
      }
      
      if (!moderationResult.isSafe) {
        Swal.fire({
          icon: 'warning',
          title: '内容审核未通过',
          text: moderationResult.message,
          confirmButtonText: '确定'
        });
        return;
      }
    }
    
    onSubmit(content, images);
    setContent('');
    setImages([]);
  };

  // 点击外部关闭表情选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <form onSubmit={handleSubmit} className="rounded-lg">
      {/* 回复提示 */}
      {replyingTo && (
        <div className="mb-3 p-2 bg-cyan-50 border border-cyan-200 rounded-lg flex items-center justify-between">
          <span className="text-sm text-cyan-700">
            回复 <span className="font-medium">{replyingTo.username}</span>
          </span>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="text-cyan-600 hover:text-cyan-800 text-sm"
            >
              取消回复
            </button>
          )}
        </div>
      )}
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={avatarUrl} size="md" />
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyingTo ? `回复 ${replyingTo.username}...` : placeholder}
              className="w-full p-3 bg-white border border-gray-200 rounded-lg resize-none min-h-[80px] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              {/* 图片上传按钮 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 9}
                className="p-2 text-gray-400 hover:text-cyan-500 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="上传图片"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
              {/* 表情按钮 */}
              <button
                type="button"
                ref={emojiButtonRef}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-400 hover:text-cyan-500 rounded-full hover:bg-gray-100 transition-colors"
                title="选择表情"
              >
                <FaceSmileIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
            className="hidden"
          />

          {/* 图片预览 */}
          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-6 gap-2">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`上传的图片 ${index + 1}`}
                    className="w-full h-20 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {/* 上传中的占位符 */}
              {uploading && (
                <div className="w-full h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                </div>
              )}
            </div>
          )}

          {/* 表情选择器 */}
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef}
              className="absolute z-50 mt-2"
              style={{ transform: 'scale(0.8)', transformOrigin: 'bottom right' }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                autoFocusSearch={false}
                lazyLoadEmojis={true}
                searchPlaceHolder="搜索表情..."
                theme={Theme.LIGHT}
              />
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {images.length > 0 && (
                <span>{images.length}/9 张图片</span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
                disabled={!content.trim() && images.length === 0}
              >
                {replyingTo ? '回复' : '评论'}
              </button>
              {replyingTo && onCancelReply && (
                <button
                  type="button"
                  onClick={onCancelReply}
                  className="ml-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}; 